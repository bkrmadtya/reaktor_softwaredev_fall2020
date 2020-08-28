// fetch file from the server
export const fetchData = async () => {
  try {
    const response = await fetch(`/api/file`);
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};
