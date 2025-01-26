import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON('../lib/projects.json')
const projectsContainer = document.querySelector('.projects')
renderProjects(projects, projectsContainer, 'h2')


function countProjects(projects, containerElement) {
    containerElement.innerHTML = ''
    let h1 = document.createElement('h1')
    h1.innerText = `${projects.length} Projects`
    containerElement.appendChild(h1);
}

const titleContainer = document.querySelector('.projects-title')
countProjects(projects, titleContainer)