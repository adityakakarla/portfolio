import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = await fetchJSON('../lib/projects.json')
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

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10)

let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {

    query = event.target.value;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    renderProjects(filteredProjects, projectsContainer, 'h2')
    renderPieChart(filteredProjects);

});

let selectedIndex = -1
function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    )

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));


    let newLegend = d3.select('.legend');
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    newArcs.forEach((arc, idx) => {
        newSVG
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                console.log(selectedIndex)
                newSVG
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? "selected" : ""
                    ));

                newLegend
                    .selectAll('li')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? "selected" : ""
                    ));

                let selectedYear = selectedIndex !== -1 ? newData[selectedIndex].label : null;

                let filteredProjects = selectedYear
                    ? projects.filter((p) => {
                        let values = Object.values(p).join('\n').toLowerCase();
                        return values.includes(query.toLowerCase()) && p.year === selectedYear
                    })
                    : projects;

                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    })


    newLegend.selectAll('li').remove();
    newData.forEach((d, idx) => {
        newLegend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    })
}

renderPieChart(projects);