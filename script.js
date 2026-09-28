const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatStars(stars) {
  return new Intl.NumberFormat().format(stars);
}

function renderRepository(repository, index) {
  const item = document.createElement("li");
  item.className = "repository-item";
  item.style.animationDelay = `${index * 70}ms`;

  const details = document.createElement("div");
  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = repository.url;
  link.textContent = repository.repository;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;
  details.append(link, description);

  const meta = document.createElement("div");
  meta.className = "repository-meta";

  const language = document.createElement("span");
  language.className = "repository-language";
  language.textContent = repository.language;

  const stars = document.createElement("span");
  stars.textContent = `${formatStars(repository.stars)} stars`;

  const date = document.createElement("time");
  date.dateTime = repository.starred_at;
  date.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${repository.starred_at}T00:00:00Z`))}`;

  meta.append(language, stars, date);
  item.append(details, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a JSON array");
    }

    repositoryList.replaceChildren(
      ...repositories.map((repository, index) => renderRepository(repository, index)),
    );
    repositoryCount.textContent = `${repositories.length} repositories`;
    repositoryList.setAttribute("aria-busy", "false");
  } catch (error) {
    const message = document.createElement("li");
    message.className = "list-message";
    message.setAttribute("role", "alert");
    message.textContent = "Could not load repositories. Try opening this page from a local web server.";
    repositoryList.replaceChildren(message);
    repositoryList.setAttribute("aria-busy", "false");
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();