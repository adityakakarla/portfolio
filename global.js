console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector))
}

// const navLinks = $$("nav a")

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// )

// currentLink?.classList.add('current')

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'meta/', title: 'Meta' },
    { url: 'https://github.com/adityakakarla', title: 'Github' }
]

let nav = document.createElement('nav')
document.body.prepend(nav)

const ARE_WE_HOME = document.documentElement.classList.contains('home')

for (let p of pages) {
    let url = p.url
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let title = p.title

    let a = document.createElement('a')
    a.href = url
    a.textContent = title
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    if (a.host !== location.host) {
        a.target = "_blank"
    }
    nav.append(a)
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="light dark">Automatic</option>
          </select>
      </label>`
);

let themeSelect = $$("label.color-scheme select")[0]

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    themeSelect.value = localStorage.colorScheme
}

themeSelect.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value)
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
})

let contactForm = $$("form.contact-form")[0]

contactForm?.addEventListener('submit', function (event) {
    event.preventDefault()
    let url = contactForm.action + '?'
    let data = new FormData(contactForm)
    let i = 0
    for (let [name, value] of data) {
        if (i !== 0) {
            url += '&'
        }
        url += `${name}=${value}`
        i += 1;
    }
    location.href = url
})

export async function fetchJSON(url) {
    try {
        console.log(url)
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        // console.log(response)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('error fetching or parsing JSON data: ', error)
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = ''
    for (let i = 0; i < projects.length; i++) {
        let project = projects[i]
        const article = document.createElement('article')
        if ('url' in project) {
            console.log(project.title)
            article.innerHTML = `
        <a href=${project.url}><${headingLevel}>${project.title}</${headingLevel}></a>
        <img src="${project.image}" alt="${project.title}">
        <div>
        <p>${project.description}</p>
        <p>${project.year}</p>
        </div>
    `;
        } else {

            article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">
        <div>
        <p>${project.description}</p>
        <p>${project.year}</p>
        </div>
    `;
        }
        containerElement.appendChild(article);
    }
}

export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`)
}