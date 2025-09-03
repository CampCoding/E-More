function useGetUserData() {
  const raw = localStorage.getItem("elmataryapp");
  let userData = null;

  if (raw) {
    try {
      const json = decodeURIComponent(escape(atob(raw)));
      userData = JSON.parse(json);
      return userData;
    } catch (e) {
      console.error("Failed to Base64-decode user data:", e);
    }
  }
}


export default useGetUserData;