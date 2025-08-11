function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: long} = position.coords;
      const latlong = new google.maps.LatLng(lat, long);
      const li = stringToHTML(`
          <li class="sent">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            
          </li>
      `);

      const p = stringToHTML(`<p id='location-me' style='width: 200px; height:150px;'></p>`);
      const myOptions = {
        center: latlong,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
        }
      };
      const map = new google.maps.Map(p, myOptions);
      li.appendChild(p)
      document.querySelector('.messages ul').appendChild(li);
      new google.maps.Marker({
        position: latlong,
        map,
        title: 'Your are here'
      })
    }, 
    (error) => {
      const li = stringToHTML(`
          <li class="sent">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            
          </li>
      `);
      const p = stringToHTML(`<p id='location-me' style='width: 200px; height:150px;'>${error.message}</p>`);
      li.appendChild(p)
      document.querySelector('.messages ul').appendChild(li)
    })
}
