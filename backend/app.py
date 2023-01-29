import io, os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from PIL import Image
import base64
import time

from keras.models import Model
from tensorflow.keras.applications.resnet50 import ResNet50

from models_for_deployment import (
    create_image_embeddings_and_labels_df_from_organized,
    build_annoy_tree,
    search_similar_images_by_path,
    plot_images_labels,
)

ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
cors = CORS(app)
# app.config["CORS_HEADERS"] = "Content-Type"

# some import directories
root_dir = "images_data/arch_100k_dataset_raw_sketches_public_only"
pickle_dir = "embeddings_data/embeddings_sketches_Resnet50_organized_public_only"
high_quality_dir = "images_data/arch_100k_dataset_organized_public_only"

# initialize model
model = ResNet50(weights="imagenet", include_top=True, input_shape=(224, 224, 3))
custom_model = Model(model.inputs, model.layers[-2].output)

# getting embeddings and embedded filenames (temporary: txt) from pickle files
image_embeddings_and_labels_df = create_image_embeddings_and_labels_df_from_organized(pickle_dir)

# build annoy tree
annoy_tree = build_annoy_tree(image_embeddings_and_labels_df, 200)


def encode_image(image_path):
    pil_img = Image.open(image_path, mode="r")  # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format="PNG")  # convert the PIL image to byte array
    encoded_img = base64.encodebytes(byte_arr.getvalue()).decode(
        "ascii"
    )  # encode as base64
    return encoded_img


@app.route("/sketch", methods=["POST", "GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def sketch():

    search_image_base64 = request.json["search_image"]
    search_image_base64 = search_image_base64.split(",")[1]
    search_image_decoded = base64.b64decode(str(search_image_base64))

    current_time = time.time()
    path = "search_images/" + str(current_time) + ".jpg"

    with open(path, "wb") as fh:
        fh.write(search_image_decoded)

    similar_images_paths = search_similar_images_by_path(
        path, custom_model, image_embeddings_and_labels_df, annoy_tree, degree_of_nn=30
    )
    print(similar_images_paths)
    plot_images_labels(path, similar_images_paths, high_quality_dir)

    encoded_imges = []
    for image_path in similar_images_paths:
        encoded_imges.append(encode_image(os.path.join(high_quality_dir, image_path)))

    return jsonify({"result": encoded_imges})


@app.route("/upload", methods=["POST", "GET"])
@cross_origin(origin="*")
def upload():

    if request.method == "POST":
        # check if the post request has the file part
        if "search-image" not in request.files:
            print("No file part")

        file = request.files["search-image"]
        print(file)
        print(file.filename)

        path = os.path.join("search_images/", file.filename)
        file.save(path)

        similar_images_paths = search_similar_images_by_path(
            path, custom_model, image_embeddings_and_labels_df, annoy_tree, degree_of_nn=30
        )
        print(similar_images_paths)
        plot_images_labels(path, similar_images_paths, high_quality_dir)

        encoded_imges = []
        for image_path in similar_images_paths:
            encoded_imges.append(
                encode_image(os.path.join(high_quality_dir, image_path))
            )

    return jsonify({"result": encoded_imges})


if __name__ == "__main__":
    # app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=('server.crt', 'server.key'))
    app.run(host="0.0.0.0", port=5000, debug=False)
