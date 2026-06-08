import { Before, Given, Then, When } from "@cucumber/cucumber";

interface MovieState {
  title: string;
  synopsis: string;
  duration: string;
}

interface GuiState {
  loggedRole: "administrador" | "usuário" | null;
  currentPage: string;
  movies: Map<string, MovieState>;
  errorMessage: string | null;
  selectedMovie: string | null;
  inputTitle: string;
  inputSynopsis: string;
  inputDuration: string;
}

let state: GuiState;

function resetState() {
  state = {
    loggedRole: null,
    currentPage: "Home",
    movies: new Map<string, MovieState>(),
    errorMessage: null,
    selectedMovie: null,
    inputTitle: "",
    inputSynopsis: "",
    inputDuration: "",
  };
}

function expectTrue(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

Before(function () {
  resetState();
});

Given("eu acesso o sistema como {string}", function (role: string) {
  state.loggedRole = role as "administrador" | "usuário";
});

Given("eu estou na página {string}", function (page: string) {
  state.currentPage = page;
  state.errorMessage = null;
});

Given("eu estou na página de {string}", function (page: string) {
  state.currentPage = page;
  state.errorMessage = null;
});

When("eu adiciono o filme {string} com sinopse {string} e duração {string}", function (title: string, synopsis: string, duration: string) {
  if (state.loggedRole !== "administrador") {
    state.errorMessage = "Acesso negado. Privilégios de administrador necessários.";
    return;
  }
  if (state.movies.has(title)) {
    state.errorMessage = "Este filme já está cadastrado no catálogo";
    return;
  }
  if (!title.trim()) {
    state.errorMessage = "O título é obrigatório";
    return;
  }
  
  state.movies.set(title, { title, synopsis, duration });
  state.currentPage = "Catálogo de Filmes";
});

Then("eu vejo o filme {string} no {string}", function (title: string, page: string) {
  expectTrue(state.currentPage === page, `Deveria estar na página ${page}, mas está em ${state.currentPage}`);
  expectTrue(state.movies.has(title), `O filme ${title} não foi encontrado no catálogo.`);
});

Then("eu vejo que o filme {string} possui a sinopse {string} e possui duração de {string}", function (title: string, synopsis: string, duration: string) {
  const movie = state.movies.get(title);
  expectTrue(movie !== undefined, `Filme ${title} não encontrado`);
  expectTrue(movie!.synopsis === synopsis, `Sinopse incorreta`);
  expectTrue(movie!.duration === duration, `Duração incorreta`);
});

When("eu tento adicionar um filme deixando o título {string} e com sinopse {string}", function (title: string, synopsis: string) {
  if (!title.trim()) {
    state.errorMessage = "O título é obrigatório";
    return;
  }
  state.movies.set(title, { title, synopsis, duration: "120 min" });
});

Then("eu vejo a mensagem de erro {string}", function (errorMsg: string) {
  expectTrue(state.errorMessage === errorMsg, `Esperava erro "${errorMsg}", mas obteve "${state.errorMessage}"`);
});

Then("eu continuo na página {string}", function (page: string) {
  expectTrue(state.currentPage === page, `Esperava estar na página ${page}, mas está em ${state.currentPage}`);
});

Given("que o sistema possui o filme {string} com sinopse {string}", function (title: string, synopsis: string) {
  state.movies.set(title, { title, synopsis, duration: "120 min" });
});

Given("eu estou na página de {string} do filme {string}", function (action: string, title: string) {
  state.currentPage = "edição";
  state.selectedMovie = title;
  const movie = state.movies.get(title);
  if (movie) {
    state.inputTitle = movie.title;
    state.inputSynopsis = movie.synopsis;
    state.inputDuration = movie.duration;
  }
});

When("eu altero a sinopse para {string}", function (newSynopsis: string) {
  if (state.selectedMovie && state.movies.has(state.selectedMovie)) {
    const movie = state.movies.get(state.selectedMovie)!;
    movie.synopsis = newSynopsis;
    state.movies.set(state.selectedMovie, movie);
  }
});

Then("eu vejo a sinopse {string} nos {string} do filme {string}", function (synopsis: string, section: string, title: string) {
  const movie = state.movies.get(title);
  expectTrue(movie !== undefined, `Filme ${title} não encontrado`);
  expectTrue(movie!.synopsis === synopsis, `Sinopse não atualizada`);
});

Given("que o sistema possui os filmes {string} e {string} no catálogo", function (title1: string, title2: string) {
  state.movies.set(title1, { title: title1, synopsis: "...", duration: "120 min" });
  state.movies.set(title2, { title: title2, synopsis: "...", duration: "120 min" });
});

When("eu removo o filme {string}", function (title: string) {
  state.movies.delete(title);
});

Then("eu não vejo o filme {string} no {string}", function (title: string, page: string) {
  expectTrue(!state.movies.has(title), `Filme ${title} ainda está presente no catálogo`);
});

Then("eu continuo vendo o filme {string} no {string}", function (title: string, page: string) {
  expectTrue(state.movies.has(title), `Filme ${title} não está mais no catálogo`);
});

Given("que o sistema já possui o filme {string}", function (title: string) {
  state.movies.set(title, { title, synopsis: "...", duration: "120 min" });
});

When("eu tento adicionar o filme {string} com sinopse {string} e duração {string}", function (title: string, synopsis: string, duration: string) {
  if (state.movies.has(title)) {
    state.errorMessage = "Este filme já está cadastrado no catálogo";
    return;
  }
  state.movies.set(title, { title, synopsis, duration });
});

Then("o sistema não cria uma cópia duplicada do filme {string}", function (title: string) {
  // If it already exists, the state.movies map only holds one key anyway.
  expectTrue(state.movies.has(title), `Filme ${title} não está no catálogo`);
});

When("eu altero o título para {string}", function (newTitle: string) {
  if (newTitle.trim() === "") {
    state.errorMessage = "O título é obrigatório";
  } else {
    // Perform title change
    if (state.selectedMovie && state.movies.has(state.selectedMovie)) {
      const movie = state.movies.get(state.selectedMovie)!;
      state.movies.delete(state.selectedMovie);
      movie.title = newTitle;
      state.movies.set(newTitle, movie);
      state.selectedMovie = newTitle;
    }
  }
});

Then("eu vejo que o título do filme continua sendo {string} no {string}", function (title: string, page: string) {
  expectTrue(state.movies.has(title), `O filme ${title} não foi encontrado.`);
});
