import os
import pickle
import numpy as np
import pandas as pd
from numpy.linalg import norm
from tqdm import tqdm
from keras.models import Model
from tensorflow.keras.applications.resnet50 import preprocess_input
import keras.utils as image
from annoy import AnnoyIndex
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

from tensorflow.keras.applications.resnet50 import ResNet50


# find Images in the Root Directiry and making list of those Images
def get_file_list(root_dir):

    file_list = []
    extensions = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".txt", ".pickle"]

    for root, directories, filenames in os.walk(root_dir):
        for filename in filenames:
            if any(ext in filename for ext in extensions):
                file_list.append(os.path.join(root, filename))

    file_list = sorted(file_list)

    return file_list


# define Function to create image embeddings
def create_single_image_embeddings(image_path, initialized_model):

    # preprocessing input Image
    input_shape = (224, 224, 3)
    img = image.load_img(
        image_path, target_size=(input_shape[0], input_shape[1])
    )  # reshape input image size into target size
    img_array = image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)

    # getting features from the Image
    features_array = initialized_model.predict(preprocessed_img)
    flattened_features_array = features_array.flatten()
    normalized_features_array = flattened_features_array / norm(
        flattened_features_array
    )

    return normalized_features_array


def create_image_embeddings_and_labels_df_from_organized(organized_embeddings_pickle_file_path):

    organized_embeddings_files_names = get_file_list(organized_embeddings_pickle_file_path)

    image_embeddings_and_labels_df = pd.DataFrame()
    for embedding_file_name in organized_embeddings_files_names:

        embeddings_list = pickle.load(open(embedding_file_name, "rb"))
        label = embedding_file_name.split('_')[-1].split('.')[0] # split by "_", then remove ".pickle"

        images_files_names_with_label = get_file_list(f'''images_data/arch_100k_dataset_organized_public_only/{label}''')
        length_images_files_names_with_label  = len(images_files_names_with_label)
        file_label_list = [label for i in range(length_images_files_names_with_label)]

        file_paths_list = []
        for f_index in range(length_images_files_names_with_label):
            file_path = (images_files_names_with_label[f_index])
            file_paths_list.append(file_path)

        images_label_and_embeddings_df = pd.DataFrame(
            {"img_id": file_paths_list, "labels": file_label_list, "img_embs": embeddings_list}
        )

        image_embeddings_and_labels_df = image_embeddings_and_labels_df.append(images_label_and_embeddings_df)

    image_embeddings_and_labels_df.reset_index(inplace=True) # reset index

    return image_embeddings_and_labels_df


def get_similar_images_df_from_path(
    image_path,
    initialized_model,
    image_embeddings_and_labels_df,
    built_annoy_tree,
    degree_of_nn,
):

    embedded_image_vector = create_single_image_embeddings(
        image_path, initialized_model
    )

    similar_img_ids = built_annoy_tree.get_nns_by_vector(
        embedded_image_vector, degree_of_nn
    )

    return image_embeddings_and_labels_df.iloc[similar_img_ids[1:]]


def get_similar_images_df_from_index(
    image_index, image_embeddings_and_labels_df, built_annoy_tree, degree_of_nn
):

    similar_img_ids = built_annoy_tree.get_nns_by_item(image_index, degree_of_nn)

    return image_embeddings_and_labels_df.iloc[similar_img_ids[1:]]


def build_annoy_tree(images_df, tree_depth):

    # build annoy tree
    vector_length = len(images_df["img_embs"][0])
    tree = AnnoyIndex(vector_length, metric="euclidean")

    for i in tqdm(range(len(images_df["img_embs"]))):
        tree.add_item(i, images_df["img_embs"][i])

    _ = tree.build(tree_depth)  # number of trees to build

    return tree


def search_similar_images_by_path(
    query_image_path,
    model,
    image_embeddings_and_labels_df,
    built_annoy_tree,
    degree_of_nn,
):
    def _get_high_quality_images_paths_from_similar_images_df(image_df):

        image_list = image_df["img_id"].to_list()

        full_image_paths = []

        for i in range(len(image_list)):

            image_name_parts = image_list[i].split(
                "."
            )  # remove .png tail (from sketch output)
            image_name = image_name_parts[0] + ".jpg"

            image_name_parts = image_name.split("/")
            image_name = image_name_parts[-2:]
            path = '/'.join(image_name)

            if path not in full_image_paths:
                full_image_paths.append(path)

        return full_image_paths

    similar_images_df = get_similar_images_df_from_path(
        query_image_path,
        model,
        image_embeddings_and_labels_df,
        built_annoy_tree,
        degree_of_nn,
    )
    print(similar_images_df)
    similar_images_paths = _get_high_quality_images_paths_from_similar_images_df(
        similar_images_df
    )

    return similar_images_paths


def plot_images_architects(query_image_path, similar_images_paths, hq_dir, labels_dir=None):

    if labels_dir:
        labels_list = open(labels_dir, "r").read().split("\n")

    def get_architect_name(image_path):

        image_name = image_path.split("/")[-1]
        name_parts = image_name.split(" ")[:-1]

        for i in range(len(name_parts)):
            if name_parts[-1] in labels_list:
                name_parts.pop()

        return " ".join(name_parts)

    # plot.
    plt.figure(figsize=(16, 9))
    plt.subplot(5, 6, 1)
    image = mpimg.imread(query_image_path)
    plt.imshow(image)
    plt.title("Search Image")
    plt.axis("off")

    if len(similar_images_paths) > 29:
        plot_count = 29
    else:
        plot_count = len(similar_images_paths)

    for i in range(plot_count):

        similar_image_path = os.path.join(hq_dir, similar_images_paths[i])

        print(similar_image_path)

        similar_image = mpimg.imread(similar_image_path)
        plt.subplot(5, 6, i + 2)
        plt.imshow(similar_image)
        if labels_dir:
            plt.title(get_architect_name(similar_image_path))
        else:
            plt.title("Similar Image")
        plt.axis("off")

    plt.show()


def plot_images_labels(query_image_path, similar_images_paths, hq_dir):

    def get_image_label(image_path):
        image_path_parts = image_path.split('/')
        image_label = image_path_parts[0]
        return image_label

    # plot.
    plt.figure(figsize=(16, 9))
    plt.subplot(5, 6, 1)
    image = mpimg.imread(query_image_path)
    plt.imshow(image)
    plt.title("Search Image")
    plt.axis("off")

    if len(similar_images_paths) > 29:
        plot_count = 29
    else:
        plot_count = len(similar_images_paths)

    for i in range(plot_count):

        similar_image_path = os.path.join(hq_dir, similar_images_paths[i])

        print(similar_image_path)

        similar_image = mpimg.imread(similar_image_path)
        plt.subplot(5, 6, i + 2)
        plt.imshow(similar_image)
        plt.title(get_image_label(similar_images_paths[i]))
        plt.axis("off")

    plt.show()


if __name__ == "__main__":

    # some import directories
    root_dir = "images_data/arch_100k_dataset_raw_sketches_public_only"
    pickle_dir = "embeddings_data/embeddings_sketches_Resnet50_public_nodrawings.pickle"
    high_quality_dir = "images_data/arch_100k_dataset_raw_public_only"

    # initialize model
    model = ResNet50(weights="imagenet", include_top=True, input_shape=(224, 224, 3))
    custom_model = Model(model.inputs, model.layers[-2].output)

    # getting embeddings and embedded filenames (temporary: txt) from pickle files
    image_embeddings_and_labels_df = create_image_embeddings_and_labels_df_from_organized(pickle_dir)

    # build annoy tree
    annoy_tree = build_annoy_tree(image_embeddings_and_labels_df, 200)

    # find similar images and plot
    for image_name in [
        "chameleon.png",
        "cooper.jpg",
        "overlaying_sq.png",
        "building_interior.jpg",
        "not_circle.jpg",
    ]:
        path = "../test_images/" + image_name
        plot_images_labels(
            path,
            search_similar_images_by_path(
                path, custom_model, image_embeddings_and_labels_df, annoy_tree, 30
            ),
            high_quality_dir
        )
