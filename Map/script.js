;(function () {
  'use strict'

  const shops = [
    {
      id: 1292273001,
      name: '매콤돈가스&칡불냉면 판교점',
      lat: 37.40189834738935,
      lng: 127.10624455094185,
    },
    {
      id: 1151112822,
      name: '탄탄면공방 판교테크노밸리점',
      lat: 37.40193038525563,
      lng: 127.11060980539878,
    },
    {
      id: 15775065,
      name: '파리바게뜨 판교테크노점',
      lat: 37.40133360873933,
      lng: 127.10801128231743,
    },
  ]

  const defaultPos = {
    lat: 37.4020589,
    lng: 127.1064401,
  }

  const get = (target) => {
    return document.querySelector(target)
  }

  const $map = get('#map');

  const mapContainer = new kakao.maps.Map($map, {
    center: new kakao.maps.LatLng(defaultPos.lat, defaultPos.lng),
    level: 3
  });

  // 참고: https://apis.map.kakao.com/web/sample/multipleMarkerImage/

  // marker image 생성
  const createMarkerImage = () => {
    const markerImageSrc = 'assets/marker.png';
    const imageSize = new kakao.maps.Size(30, 46);
    return new kakao.maps.MarkerImage(markerImageSrc, imageSize);
  }

  // marker 생성
  const createMarker = (lat, lng) => {
    const marker = new kakao.maps.Marker({
      map: mapContainer,
      position: new kakao.maps.LatLng(lat, lng),
      image: createMarkerImage()
    })

    return marker;
  }

  const createShopElement = () => {
    shops.map((shop) => {
      const {lat, lng} = shop
      const marker = createMarker(lat, lng)
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 2px;">
                  <a href="https://place.map.kakao.com/${shop.id}" target="_blank">${shop.name}</a>
                </div>`,
      })

      infowindow.open(mapContainer, marker)
    })
  }

  // 참고: https://apis.map.kakao.com/web/sample/markerWithInfoWindow/


  const init = () => {
    createShopElement()
  }

  init()
})()
