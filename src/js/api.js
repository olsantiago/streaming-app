var BASEURL = 'https://cd-static.bamgrid.com/dp-117731241344';

export const getData = () => new Promise((res, rej) => {
  fetch(`${BASEURL}/home.json`)
    .then(response => response.json())
    .then(({ data }) => {
      res(data?.StandardCollection?.containers);
    })
    .catch((error) => {
      // should be handled by showing a modal error message
      console.log(error);
      rej(error);
    });
});

export const getItems = (refId) => new Promise((res, rej) => {
  fetch(`${BASEURL}/sets/${refId}.json`)
    .then(response => response.json())
    .then(({ data }) => {
      res(data);
    })
    .catch((error) => {
      // should be handled by showing a modal error message
      console.log(error);
      rej(error);
    });
});

