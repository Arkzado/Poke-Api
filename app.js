let btnBuscar = document.querySelector("#botonBuscar");
btnBuscar.addEventListener("click", buscar);
//prueba 2
function buscar() {
  let nombreIngresado = document.querySelector("#pokemonIngresado").value;
  buscarPokemon(nombreIngresado);
}
async function buscarPokemon(nombreIngresado) {
  let nombre, imagen, habilidades, habitat, color, tipoPokemon;
  try {
    let respuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nombreIngresado}`
    );
    let pokemon = await respuesta.json();
    nombre = pokemon.name;
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
  }
}

function mostrarPokemon(datos) {
  let divMostrar = document.querySelector("#mostrar");
  divMostrar.innerHTML = `
  <div class="card" style="width: 18rem;">
  <img src="${datos.imagen}" class="card-img-top" style="background: linear-gradient(${datos.color}, white);">
  <div class="card-body">
    <h5 class="card-title">${datos.nombre}</h5>
    <p class="card-text"><b>Habitat:</b> ${datos.habitat}<br>
    <b>Habilidades:</b> ${datos.habilidades}<br>
    <b>Pokemon tipo:</b> ${datos.tipoPokemon}</p>
  </div>
  </div>`;
  console.log(datos);
}
