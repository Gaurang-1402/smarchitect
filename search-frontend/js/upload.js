// --- show upload area ---
function show_upload_area() {
    document.getElementById('upload-button').addEventListener('click', function (e) {
        document.getElementById('canvas').classList.add('hidden');
        document.getElementById('controls').classList.add('hidden');
        document.getElementById('upload-button').classList.add('hidden');
        document.getElementById('mobile-search').classList.add('hidden');
        document.getElementById('dropzone').classList.remove('hidden');
        document.getElementById('sketch-button').classList.remove('hidden');
    });
}

// --- show sketch area ---
function show_sketch_area() {
    var md_width = window.matchMedia("(max-width: 768px)")
    document.getElementById('sketch-button').addEventListener('click', function (e) {
        document.getElementById('canvas').classList.remove('hidden');
        document.getElementById('controls').classList.remove('hidden');
        document.getElementById('sketch-button').classList.add('hidden');
        if (md_width.matches) {
            document.getElementById('mobile-search').classList.remove('hidden');
        }
        document.getElementById('dropzone').classList.add('hidden');
        document.getElementById('uploaded-image').classList.add('hidden');
        document.getElementById('upload-button').classList.remove('hidden');
    });
}

// --- save canvas as image ---
function canvas_to_image() {

    var canvas = document.getElementById("canvas");

    document.getElementById('search-button').addEventListener('click', function () {

        var context = canvas.getContext("2d");

        context.globalCompositeOperation = 'destination-over' // Add behind elements.
        context.fillStyle = "#e5e7eb"; // light-gray
        context.fillRect(0, 0, canvas.width, canvas.height);

        let canvasUrl = canvas.toDataURL("image/jpeg", 0.5);

        document.getElementById("gallery-images").innerHTML = "";

        fetch('http://172.28.169.136:5000/sketch', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ search_image: canvasUrl }) })
            .then(response => response.json())
            .then(data => {

                document.getElementById('gallery').classList.remove('hidden');
                document.getElementById('sketch-interface').classList.remove('mx-auto');
                document.getElementById('sketch-interface').classList.add('left-0');

                var encoded_images = data.similar_images;
                var building_names = data.building_names;

                // Create a container element to hold the images
                var container = document.getElementById("gallery-images");

                // Iterate through the list of encoded images
                for (var i = 0; i < encoded_images.length; i++) {
                    // Create a new img element
                    var img = document.createElement("img");

                    // Set the src of the img element to the base64 encoded image
                    img.src = "data:image/jpeg;base64," + encoded_images[i];
                    img.classList.add('rounded-md');

                    var building_name_string = building_names[i];

                    var arch_daily_link = "http://www.google.com/search?hl=en&q=" + building_name_string + "&btnI=I"
                    var a = document.createElement('a');
                    a.setAttribute('target', '_blank');
                    a.setAttribute('href', arch_daily_link);

                    var p = document.createElement('p');
                    p.innerHTML = building_name_string;
                    p.classList.add('px-2');
                    p.classList.add('py-2.5');
                    p.classList.add('text-base');
                    p.classList.add('font-light');

                    var div_id = "div_" + i
                    a.appendChild(img);
                    a.id = div_id

                    container.appendChild(a);
                    container.appendChild(p)
                }

            })
            .catch(error => {
                console.error("Error fetching images:", error);
            });

    });
}

// --- uplaod file ---
function post_uploaded_file() {
    document.getElementById("dropzone-file").onchange = async function (e) {
        var search_image_file = document.getElementById('dropzone-file').files[0];
        let form_data = new FormData()
        form_data.append("search-image", search_image_file);

        document.getElementById("gallery-images").innerHTML = "";

        fetch('http://172.28.169.136:5000/upload', { method: 'POST', body: form_data })
        .then(response => response.json())
        .then(data => {

            document.getElementById('dropzone').classList.add('hidden');
            document.getElementById('uploaded-image').src = URL.createObjectURL(search_image_file);
            document.getElementById('uploaded-image').classList.remove('hidden');

            document.getElementById('gallery').classList.remove('hidden');
            document.getElementById('sketch-interface').classList.remove('mx-auto');
            document.getElementById('sketch-interface').classList.add('left-0');

            var encoded_images = data.similar_images;
            var building_names = data.building_names;

            // Create a container element to hold the images
            var container = document.getElementById("gallery-images");

            // Iterate through the list of encoded images
            for (var i = 0; i < encoded_images.length; i++) {
                // Create a new img element
                var img = document.createElement("img");

                // Set the src of the img element to the base64 encoded image
                img.src = "data:image/jpeg;base64," + encoded_images[i];
                img.classList.add('rounded-md');

                var building_name_string = building_names[i];

                var arch_daily_link = "http://www.google.com/search?hl=en&q=" + building_name_string + "&btnI=I"
                var a = document.createElement('a');
                a.setAttribute('target', '_blank');
                a.setAttribute('href', arch_daily_link);

                var p = document.createElement('p');
                p.innerHTML = building_name_string;
                p.classList.add('px-2');
                p.classList.add('py-2.5');
                p.classList.add('text-base');
                p.classList.add('font-light');

                var div_id = "div_" + i
                a.appendChild(img);
                a.id = div_id

                container.appendChild(a);
                container.appendChild(p)
            }

        })
        .catch(error => {
            console.error("Error fetching images:", error);
        });
    }
}

show_upload_area();
show_sketch_area();

canvas_to_image();
post_uploaded_file();
