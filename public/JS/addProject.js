const container = document.querySelector("projects-container");

let projectIndex = 1; // start from 1 since 0 is already used

document.getElementById("add-project").addEventListener("click", function () {
    console.log(container);
    console.log("Kaam kar raha hai");

    const projectHTML = `
        <div class="project-item">
            <label class="form-label" for="projectTitle${projectIndex}">Project Title:</label>
            <input class="form-control" type="text" name="user[projects][${projectIndex}][title]" id="projectTitle${projectIndex}">

            <label class="form-label" for="projectDescription${projectIndex}">Description:</label>
            <textarea class="form-control" name="user[projects][${projectIndex}][description]" id="projectDescription${projectIndex}"></textarea>

            <label class="form-label" for="projectLink${projectIndex}">Link:</label>
            <input class="form-control" type="url" name="user[projects][${projectIndex}][link]" id="projectLink${projectIndex}">

            <button type="button" class="btn btn-danger mt-2 remove-project">Remove</button>
            <hr>
        </div>
    `;

    container.appendChild(projectHTML);
    projectIndex++;
});


// Event delegation for remove button
document.getElementById("projects-container").addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-project")) {
        e.target.parentElement.remove();
    }
});