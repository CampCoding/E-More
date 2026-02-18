import React, { useEffect, useState } from 'react';
import { Axios } from '../../components/axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { FileText, Download, Eye } from 'lucide-react';
import Footer from '../../components/Footer/Footer';
import { decryptData } from '../../utils/decrypt';
import { Modal } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [numPages, setNumPages] = useState(null);

    const getNotes = async () => {
        const localData = localStorage.getItem("elmataryapp");
        const decryptedUserData = decryptData(localData);
        try {
            const res = await Axios({
                method: 'POST',
                url: 'https://camp-coding.tech/emore/user/courses/select_pdfs.php',
                data: {
                    student_id: decryptedUserData?.student_id,
                    token_value: decryptedUserData?.token_value,
                }
            });

            if (res.status === 'success') {
                setNotes(res.message);
            } else {
                toast.error('Failed to load notes');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while fetching notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    const handleViewPdf = (url) => {
        setSelectedPdf(url);
        setPdfModalOpen(true);
    };

    const handleClosePdf = () => {
        setPdfModalOpen(false);
        setSelectedPdf(null);
        setNumPages(null); // Reset page count
    };

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow" dir="rtl">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    المذكرات
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-48">
                                <Skeleton height={150} className="mb-4" />
                                <Skeleton height={20} width="80%" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.length > 0 ? (
                            notes.map((note) => (
                                <div
                                    key={note.book_id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
                                >
                                    <div className="p-6 flex flex-col items-center justify-center flex-grow bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <FileText size={64} className="text-blue-500 mb-4" />
                                        <h3
                                            className="text-xl font-semibold text-center text-gray-800 line-clamp-2"
                                            style={{ fontFamily: 'Cairo, sans-serif' }}
                                        >
                                            {note.book_title}
                                        </h3>
                                    </div>

                                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                        <a
                                            href={note.book_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            style={{ fontFamily: 'Cairo, sans-serif' }}
                                        >
                                            <Download size={18} />
                                            <span>تحميل</span>
                                        </a>
                                        <button
                                            onClick={() => handleViewPdf(note.book_url)}
                                            className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            style={{ fontFamily: 'Cairo, sans-serif' }}
                                        >
                                            <Eye size={18} />
                                            <span>عرض</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-xl text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                    لا توجد مذكرات متاحة حالياً
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                open={pdfModalOpen}
                onCancel={handleClosePdf}
                footer={null}
                width="100%"
                destroyOnClose
                centered
                style={{ top: 20, padding: 0 }}
                bodyStyle={{ height: '85vh', padding: 0, overflowY: 'auto'}} // Dark background for PDF viewer feel
                wrapClassName="full-screen-modal"
            >
                <div className="flex justify-center min-h-full py-8">
                    <Document
                        file={selectedPdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="text-white">جاري تحميل المذكرة...</div>}
                        error={<div className="text-red-400">فشل تحميل المذكرة.</div>}
                        className="flex flex-col items-center"
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} className="mb-4 shadow-lg">
                                <Page
                                    pageNumber={index + 1}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                    width={Math.min(window.innerWidth * 0.9, 800)} // Responsive width
                                />
                            </div>
                        ))}
                    </Document>
                </div>
            </Modal>

            <Footer />
        </div>
    );
};

export default NotesPage;
