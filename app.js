let btnBuscar = document.querySelector("#botonBuscar");
btnBuscar.addEventListener("click", buscar);

let campoPokemon = document.querySelector("#pokemonIngresado");
let formaBusqueda = document.querySelector("#formaBusqueda");
formaBusqueda.addEventListener("change", cambiarInput);

function buscar() {
  let pokemonIngresado = document.querySelector("#pokemonIngresado").value;
  pokemonIngresado = pokemonIngresado.trim().toLowerCase();
  if ((pokemonIngresado.length > 0 && formaBusqueda.value == "nombre") ||
      (pokemonIngresado > 0 && pokemonIngresado < 1025 && formaBusqueda.value == "id")) {
    buscarPokemon(pokemonIngresado);
  }
  else{
    mostrarDesconocido();
  }
}


async function buscarPokemon(nombreIngresado) {
  let nombre, imagen, habilidades, habitat, color, tipoPokemon, id;
  try {
    let respuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nombreIngresado}`
    );
    let pokemon = await respuesta.json();
    nombre = pokemon.name;
    id = pokemon.id;
    imagen = pokemon.sprites.front_default;
    objetoHabilidad = pokemon.abilities;

    let linkHabilidad = {};
    habilidades = "";

    objetoHabilidad.forEach((habilidad, index) => {
      if (index > 0) habilidades += ", ";
      habilidades += habilidad.ability.name;

      linkHabilidad[index] = habilidad.ability.url;
    });

    let respuestasHabilidad = [];

    for (let i = 0; i < Object.keys(linkHabilidad).length; i++) {
      let url = linkHabilidad[i];
      let respuesta = await fetch(url);
      let datos = await respuesta.json();
      respuestasHabilidad.push(datos);
    }
    habilidades = "";
    respuestasHabilidad.forEach((habilidadTraducida, index) => {
      if (index > 0) habilidades += ", ";
      habilidades += habilidadTraducida.names[5].name;
    });
    let especieRespuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${nombreIngresado}`
    );
    let especie = await especieRespuesta.json();

    let tipoRespuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon-form/${nombreIngresado}`
    );
    let tipoDePokemon = await tipoRespuesta.json();
    tipoPokemon = "";
    let linkTipo = {};

    let objetoTipo = tipoDePokemon.types;
    objetoTipo.forEach((tipo, index) => {
      if (index > 0) tipoPokemon += ", ";
      tipoPokemon += tipo.type.name;
      linkTipo[index] = tipo.type.url;
    });

    let respuestasTipo = [];

    for (let i = 0; i < Object.keys(linkTipo).length; i++) {
      let url = linkTipo[i];
      let respuestasDeTipo = await fetch(url);
      datoTipo = await respuestasDeTipo.json();
      respuestasTipo.push(datoTipo);
    }

    tipoPokemon = "";
    respuestasTipo.forEach((traducirTipo, index) => {
      if (index > 0) tipoPokemon += ", ";
      tipoPokemon += traducirTipo.names[5].name;
    });
    color = especie.color.name;
    habitat = especie.habitat?.name ?? "Desconocido";

    if (especie.habitat?.name) {
      let respuestHabitat = await fetch(especie.habitat.url);
      let datosHabitat = await respuestHabitat.json();
      habitat = datosHabitat.names[1].name;
    }

    let datosPokemon = {
      id,
      nombre,
      imagen,
      habilidades,
      habitat,
      color,
      tipoPokemon,
    };
    mostrarPokemon(datosPokemon);
    return;
  } catch (error) {
    console.log(error);
    mostrarDesconocido();
  }
}

function mostrarPokemon(datos) {
  let divMostrar = document.querySelector("#mostrar");
  divMostrar.innerHTML = `
  <div class="card" style="width: 18rem;">
  <img src="${datos.imagen}" class="card-img-top" style="background: linear-gradient(${datos.color}, white);">
  <div class="card-body">
    <h2 class="card-title d-flex justify-content-center">${datos.nombre}</h2>
    <p class="card-text">
    <b>ID:</b> ${datos.id} <br>
    <b>Habitat:</b> ${datos.habitat}<br>
    <b>Habilidades:</b> ${datos.habilidades}<br>
    <b>Pokemon tipo:</b> ${datos.tipoPokemon}</p>
  </div>
  </div>`;
}

function mostrarDesconocido(){
  let divMostrar = document.querySelector("#mostrar");
  divMostrar.innerHTML = `
  <div class="card" style="width: 18rem;">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJrHLXKb_Sn6Jx0xCudYsjNQDhTCsFEnoBfg&s" class="card-img-top" style="background: linear-gradient(yellow, white);">
  <div class="card-body">
    <h5 class="card-title">???</h5>
    <p class="card-text">
    <b>ID:</b> ???<br>
    <b>Habitat:</b> ???<br>
    <b>Habilidades:</b> ???<br>
    <b>Pokemon tipo:</b> ???</p>
  </div>
  </div>`;
}

function cambiarInput() {
  if (formaBusqueda.value == "id") {
    campoPokemon.removeAttribute("disabled");
    campoPokemon.setAttribute("type", "number");
    campoPokemon.setAttribute("placeholder", "25");
    campoPokemon.setAttribute("min", "0");
    campoPokemon.setAttribute("max", "1025");
  } else {
    campoPokemon.removeAttribute("disabled");
    campoPokemon.setAttribute("type", "text");
    campoPokemon.setAttribute("placeholder", "Pikachu");
  }
}

campoPokemon.addEventListener("input", function (e) {
  if (formaBusqueda.value == "nombre") {
    this.value = this.value.replace(/\d/g, "");
  }
});

campoPokemon.addEventListener("keydown", function (eventoEnter) {
  if (eventoEnter.key === "Enter") {
    buscar();
  }
});
