let series = [];
let tabFav = [];
const Save =()=>{
    localStorage.setItem('series',JSON.stringify(tabFav));
}
const Grab = async (imdb) => {
    let key = "47fba91c";
    let url = "http://www.omdbapi.com/?apikey=" + key + "&i=" + imdb ;
    const response = await fetch(url);
    const serie = await response.json();
    return serie;
}

const Afficher =  () => {
const tbody = document.getElementById("myTbody");
  tbody.innerHTML = "";
  for (let s of series) {
    const template = document.getElementById("templateTr");
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    td[0].innerHTML = s.Title;
    td[1].innerHTML = s.Year;
    clone.querySelector("img").src = s.Poster;
    clone.querySelector("img").alt = s.Title;
    clone.querySelector("button").onclick = async (evt) => {
      const tr = evt.target.closest("tr");
      const i = tr.rowIndex - 1;
      let serie= await Grab(series[i].imdbID);
    
       tabFav.push(serie);
      Fav();
      series.splice(i, 1);
      Afficher();
      Save();
    };
    tbody.append(clone);
  }
};
const Fav = () => {
  const tbody2 = document.getElementById("myTbody2");
  tbody2.innerHTML = "";

  for (let f of tabFav) {
    const template = document.getElementById("templateTr2");
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    
    td[0].innerHTML = f.Title;
    td[1].innerHTML = f.Year;
    td[2].innerHTML = f.imdbRating;
    clone.querySelector("img").src = f.Poster;
    clone.querySelector("img").alt = f.Title;
    clone.querySelector("button").onclick = (evt) => {
      const tr = evt.target.closest("tr");
      const i = tr.rowIndex - 1;
      tabFav.splice(i, 1);
      Fav();
      Save();
    };
    tbody2.append(clone);
  }
};
document.getElementById("btnSearch").onclick = async () => {
  
  let film = document.getElementById("film").value;
  document.getElementById("film").value = "";
  let key = "efdc2275";
  let url = "http://www.omdbapi.com/?apikey=" + key + "&s=" + film + "&type=series";
  const response = await fetch(url);
  const data = await response.json();

  series = data.Search;
  Afficher();
};
const data = localStorage.getItem('series');
if (data){
    tabFav= JSON.parse(data);
    Fav();
}