console.log("IT'S ALIVE!");

function $$(selector, context = document){
    return Array.from(context.querySelectorAll(selector))
}

// const navLinks = $$("nav a")

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// )

// currentLink?.classList.add('current')

let pages = [
    {url: '', title: 'Home'},
    {url: 'projects/index.html', title: 'Projects'},
    {url: 'contact/index.html', title: 'Contact'},
    {url: 'resume/index.html', title: 'Resume'},
    {url: 'https://github.com/adityakakarla', title: 'Github'}
]

let nav = document.createElement('nav')
document.body.prepend(nav)

const ARE_WE_HOME = document.documentElement.classList.contains('home')

for (let p of pages){
    let url = p.url
    if (!ARE_WE_HOME && !url.startsWith('http')){
        url = '../' + url
    }
    let title = p.title
    let a = document.createElement('a')
    a.href = url
    a.textContent = title
    if (a.host === location.host && a.pathname === location.pathname){
        a.classList.add('current')
    }
    if (a.host !== location.host){
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

if("colorScheme" in localStorage){
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    themeSelect.value = localStorage.colorScheme
}

themeSelect.addEventListener('input', function(event){
    console.log('color scheme changed to', event.target.value)
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
})

let contactForm = $$("form.contact-form")[0]

contactForm?.addEventListener('submit', function(event){
    event.preventDefault()
    let url = contactForm.action + '?'
    let data = new FormData(contactForm)
    let i = 0
    for (let [name, value] of data){
        if (i !== 0){
            url += '&'
        }
        url += `${name}=${value}`
        i += 1;
    }
    location.href = url
})

