import { useEffect, useRef, useState } from "react";
import { loadPDF } from "./helperFunctions";
import { PDFButtons } from "./PDFBUTTONS";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import Modal from "./modal";
import VoiceRecorder from "./Recording";
import WebViewer from "@pdftron/webviewer";
import axios from "axios";

function PDFViewer(props) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const [aiReply, setAiReply] = useState({
    open: false,
    data: null,
    loading: false
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [voice, setVoice] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState(false);
  const [params] = useSearchParams();
  const localData = localStorage.getItem("elmataryapp");
  const decryptedBytes = localData && CryptoJS.AES.decrypt(localData, "111");
  const userData =
    decryptedBytes && JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  const getUserAtts = (type, pageNum) => {};
  const getAttachmentForCurrentPage = (type, pageNum) => {
    if (!props?.adminAtts) return null;
    const attachment = props.adminAtts.filter(
      (att) =>
        parseInt(att.page_number) ==
          instanceRef?.current?.viewState?.currentPageIndex + 1 && att[type]
    )[0];

    return attachment ? attachment[type] : null;
  };
  const updatePageAttachments = (type, page) => {
    const imageAttachment = getAttachmentForCurrentPage(type, page);
    const videoAttachment = getAttachmentForCurrentPage(type, page);

    if (imageAttachment && imageAttachment?.length && type == "image") {
      setImage(imageAttachment);
    }
    if (videoAttachment && videoAttachment?.length && type == "video") {
      setVideo(videoAttachment);
    }
  };
  const [scrollInterval, setScrollInterval] = useState(null);

  const startScrolling = (direction) => {
    const scrollAmount = direction === 'up' ? -30 : 30;
    const interval = setInterval(() => {
      document
        .querySelector("apryse-webviewer")
        .shadowRoot.querySelector("#app")
        .querySelector(".DocumentContainer")
        .scrollBy({
          top: scrollAmount
        });
    }, 100);
    setScrollInterval(interval);
  };

  const stopScrolling = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
  };

  useEffect(() => {
    if (props.document) {
      let PSPDFKit;
      const container = containerRef.current;
      WebViewer.WebComponent(
        {
          path: "/public/",
          licenseKey:
            "demo:1727192378895:7e39b6870300000000207ec6ebc5fc8b9a7afb0d9d03cb04df490e5a9e",
          fullAPI: true
        },
        container
      ).then((instance) => {
        const { documentViewer, annotationManager, PDFNet } = instance.Core;
        instanceRef.current = instance;

        // Load the document
        instance.UI.loadDocument(props.document);

        documentViewer.addEventListener("documentLoaded", () => {
          // Load XFDF annotations if they exist
          if (props?.ann) {
            annotationManager
              .importAnnotations(props.ann)
              .then(() => {
                // Annotations loaded
              })
              .catch((err) => {
                // Error loading annotations
              });
          }

          // Add listener for annotation changes
          annotationManager.addEventListener("annotationChanged", () => {
            handleSave(annotationManager);
          });
          document
            .querySelector("apryse-webviewer")
            .shadowRoot.querySelector("#app")
            .querySelector(".DocumentContainer");
          instance.UI.setHeaderItems((header) => {
            delete header?.headers["toolbarGroup-Edit"];
            header.headers.default = header?.headers?.default?.filter(
              (item, index) => index != 0
            );

            // Save Annotations Button
            header.push({
              type: "actionButton",
              img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V8l-5-5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2M6 4h9v5h5v10H6zm4 9h4v4h-4z"/></svg>',
              onClick: () => handleSave(annotationManager),
              title: "Save Annotations"
            });

            // AI Summarize Button
            header.push({
              type: "actionButton",
              img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-8 14H7v-2h4v2m6-4H7v-2h10v2m0-4H7V7h10v2Z"/></svg>',
              title: "AI Summarize",
              onClick: async () => {
                const pageNumber = documentViewer.getCurrentPage();
                const doc = documentViewer.getDocument();
                const allAnns = annotationManager.getAnnotationsList();
                const annotsOnPage = allAnns.filter(
                  (a) => a.PageNumber === pageNumber
                );

                const xfdf = await annotationManager.exportAnnotations({
                  annotList:
                    annotsOnPage && annotsOnPage?.length ? annotsOnPage : []
                });
                const rawData = await doc.extractPages([pageNumber], xfdf);
                await PDFNet.initialize();
                let pngBytes;
                await PDFNet.runWithCleanup(async () => {
                  const srcDoc = await PDFNet.PDFDoc.createFromBuffer(rawData);
                  const pdfDraw = await PDFNet.PDFDraw.create(150);
                  const pageObj = await srcDoc.getPage(1);
                  pngBytes = await pdfDraw.exportBuffer(pageObj);
                });
                const blob = new Blob([pngBytes], { type: "image/png" });
                const base64 = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result.split(",")[1]);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                const data_send = {
                  name: "image",
                  filename: `page-${pageNumber}.png`,
                  type: "image/png",
                  image: new File([blob], `page-${pageNumber}.png`, {
                    type: "image/png"
                  })
                };
                setLoading(true);
                await axios
                  .post(
                    "https://back.dr-elmatary.com/El_Matary_Platform/platform/user/home/ai_module/image_uploads.php",
                    data_send,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data"
                      }
                    }
                  )
                  .then(async (res) => {
                    const image =
                      "https://back.dr-elmatary.com/El_Matary_Platform/platform/user/home/ai_module/" +
                      res.data.path;
                    const axios_response = await axios.post(
                      "https://back.dr-elmatary.com/El_Matary_Platform/platform/user/home/ai_module/ai_summarize_img_process.php",
                      {
                        image_url: image
                      }
                    );
                    setAiReply({
                      ...aiReply,
                      open: true,
                      data: axios_response.data?.message
                    });
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            });

            // Voice Button
            header.push({
              type: "actionButton",
              img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 10 0h2Z"/></svg>',
              onClick: () => {
                const pageNumber = documentViewer.getCurrentPage();
                setVoice(pageNumber);
              },
              title: "Voice Recorder"
            });
          });
          document.querySelector(
            "#app > div.App.is-web-component > div.Header.MainHeader > div > button:nth-child(1)"
          ).style.display = "none";
        });
      });
    }
  }, [props.document]);

  const handleSave = async (instance) => {
    if (instance) {
      const myHeaders = new Headers();
      const x = await instance?.exportAnnotations();
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          book_id: params?.get("book_id"),
          student_id: params?.get("student_id"),
          unit_id: params?.get("unit_id"),
          annotation_value: x
        }),
        redirect: "follow"
      };
      localStorage.setItem("Ann", x);

      fetch(
        "https://back.dr-elmatary.com/El_Matary_Platform/platform/user/home/book_option/save-web-view-book-annotations.php",
        requestOptions
      )
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.status) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100vh", position: "relative" }}
      id="pspdfkitContainer"
    >
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <button
          onMouseDown={() => startScrolling('up')}
          onMouseUp={stopScrolling}
          onMouseLeave={stopScrolling}
          onTouchStart={() => startScrolling('up')}
          onTouchEnd={stopScrolling}
          onClick={() => {
            document
              .querySelector("apryse-webviewer")
              .shadowRoot.querySelector("#app")
              .querySelector(".DocumentContainer")
              .scrollBy({
                top: -30
              });
          }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/>
          </svg>
        </button>
        <button
          onMouseDown={() => startScrolling('down')}
          onMouseUp={stopScrolling}
          onMouseLeave={stopScrolling}
          onTouchStart={() => startScrolling('down')}
          onTouchEnd={stopScrolling}
          onClick={() => {
            document
              .querySelector("apryse-webviewer")
              .shadowRoot.querySelector("#app")
              .querySelector(".DocumentContainer")
              .scrollBy({
                top: 30
              });
          }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"/>
          </svg>
        </button>
      </div>
      <Modal visible={image} onClose={() => setImage(null)}>
        <img src={image} alt="Attachment" />
      </Modal>
      <Modal
        visible={aiReply.open}
        onClose={() => setAiReply({ open: false, data: aiReply.data || null })}
      >
        <div dangerouslySetInnerHTML={{ __html: aiReply.data }} />
      </Modal>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {voice ? (
        <Modal
          visible={voice}
          onClose={() => {
            setVoice(null);
            setVoiceUrl(null);
          }}
        >
          <VoiceRecorder
            data={{
              student_id: userData?.student_id,
              token_value: userData?.token_value,
              page_number:
                instanceRef?.current?.viewState?.currentPageIndex + 1,
              book_id: params?.get("id"),
              atts: voiceUrl ? voiceUrl : [],
              getData: props?.getData,
              voice: voice,
              arr: props?.userAtts,
              voiceUrl: voiceUrl,
              setVoiceUrl: setVoiceUrl,
              setVoice: setVoice,
              setUserAttachmentForCurrentPage:
                props?.setUserAttachmentForCurrentPage
            }}
          />
        </Modal>
      ) : null}
      <Modal visible={video} onClose={() => setVideo(null)}>
        <div>
          <iframe
            title=""
            src={video}
            width={300}
            frameborder="0"
            webkitAllowFullScreen
            mozAllowFullScreen
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default PDFViewer; 