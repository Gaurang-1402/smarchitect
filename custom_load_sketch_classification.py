import os
import time
import pickle
import numpy as np
import pandas as pd
from numpy.linalg import norm
from tqdm import tqdm
from keras.models import load_model, Model
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import keras.utils as image
from annoy import AnnoyIndex
import matplotlib.pyplot as plt
import matplotlib.image as mpimg


# find Images in the Root Directiry and making list of those Images
def get_file_list(root_dir):

    file_list = []
    counter = 1
    extensions = ['.jpg', '.JPG', '.jpeg', '.JPEG', '.png', '.PNG', '.txt']

    for root, directories, filenames in os.walk(root_dir):
        for filename in filenames:
            if any(ext in filename for ext in extensions):
                file_list.append(os.path.join(root, filename))
                counter += 1

    file_list = sorted(file_list)

    return file_list


# define Function to create image embeddings
def create_single_image_embeddings(image_path, initialized_model):

    # preprocessing input Image
    input_shape = (224, 224, 3)
    img = image.load_img(image_path, target_size=(input_shape[0], input_shape[1]))  # reshape input image size into target size
    img_array = image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)

    # getting features from the Image
    features_array = initialized_model.predict(preprocessed_img)
    flattened_features_array = features_array.flatten()
    normalized_features_array = flattened_features_array / norm(flattened_features_array)

    return normalized_features_array


# creating embeddings for each image and saving them in a txt (temporary: future in db)
def create_images_embeddings_and_store_to_txt(list_of_image_paths, initialized_model, txt_storage_dir):

    total_images_count = len(list_of_image_paths)

    for i in range(total_images_count):

        # drop file path and type (.png)
        filename = list_of_image_paths[i].split("/")[-1]
        filename = filename[:-4]

        single_image_embedding = create_single_image_embeddings(list_of_image_paths[i], initialized_model)
        np.savetxt(f'''{txt_storage_dir}/{filename}.txt''', single_image_embedding)

        print(f'''{i} of {total_images_count}. {list_of_image_paths[i]}''')


def extract_embeddings_and_file_names_from_txt(txt_storage_dir):

    embedding_filenames_list_from_txt = get_file_list(txt_storage_dir)  # length = 16710
    embeddings_list = []

    for f_index in range(len(embedding_filenames_list_from_txt)):

        embeddings_list.append(np.loadtxt(embedding_filenames_list_from_txt[f_index]))
        # embeddings_list.append(np.loadtxt(embedding_filenames_list_from_txt[f_index + 1]))

        print(f_index)

    pickle.dump(embeddings_list, open('./embeddings_data/embeddings_sketches_customResnet50_fine.pickle', 'wb'))


def create_image_embeddings_and_labels_df(embeddings_pickle_file_path):
    embeddings_list = pickle.load(open(embeddings_pickle_file_path, 'rb'))
    train_datagen = ImageDataGenerator(rescale=1)
    train_generator = train_datagen.flow_from_directory('arch_data_sketches',
                                                        class_mode='categorical')
    print(len(train_generator.filenames))
    file_names_list = []
    labels_list = []
    for file_index in range(0, len(train_generator.filenames), 2):
        file_name_parts = train_generator.filenames[file_index + 0].split('/')
        file_name = file_name_parts[1][:-4] + '.png'
        file_names_list.append(file_name)
        label = file_name_parts[0]
        labels_list.append(label)

    print(len(embeddings_list))
    print(len(file_names_list))
    print(len(labels_list))
    image_embeddings_and_labels_df = pd.DataFrame({'img_id': file_names_list, 'img_embs': embeddings_list, 'label': labels_list})
    return image_embeddings_and_labels_df


def get_similar_images_df_from_path(image_path, initialized_model, degree_of_nn):

    start = time.time()
    embedded_image_vector = create_single_image_embeddings(image_path, initialized_model)

    similar_img_ids = t.get_nns_by_vector(embedded_image_vector, degree_of_nn)
    end = time.time()
    print(f'{(end - start) * 1000} ms')

    return image_embeddings_and_labels_df.iloc[similar_img_ids[1:]]


def get_similar_images_df_from_index(image_index, degree_of_nn):

    start = time.time()

    similar_img_ids = t.get_nns_by_item(image_index, degree_of_nn)
    end = time.time()
    print(f'{(end - start) * 1000} ms')

    return image_embeddings_and_labels_df.iloc[similar_img_ids[1:]]


def show_images(search_image_path):

    def _get_artists_amd_images_names_from_image_paths_df(image_df):

        image_list = image_df['img_id'].to_list()

        images_names = []
        artists_names = []

        for i in range(len(image_list)):

            image_name_parts = image_list[i].split('_')
            image_name = image_name_parts[0] + '.jpg'

            artist_name = 'public_buildings'

            if image_name not in images_names:
                images_names.append(image_name)
                artists_names.append(artist_name)

        return artists_names, images_names

    initial_similar_images_df = get_similar_images_df_from_path(search_image_path, custom_model, 6)
    print(initial_similar_images_df)
    # initial_artists, initial_images = _get_artists_amd_images_names_from_image_paths_df(initial_similar_images_df)

    next_image_index = list(initial_similar_images_df.index.values)
    for i in range(len(initial_similar_images_df)):
        # path = os.path.join('arch_100k_dataset', initial_artists[i], initial_images[i])
        next_similar_images_df = get_similar_images_df_from_index(next_image_index[i], 3 - i)
        initial_similar_images_df = initial_similar_images_df.append(next_similar_images_df)

        """
        deep_image_index = list(next_similar_images_df.index.values)
        if len(deep_image_index) > 0:
            deep_similar_images_df = get_similar_images_df_from_index(deep_image_index[0], 3)
            total_similar_images_df = total_similar_images_df.append(deep_similar_images_df)
        """

    to_plot_artists_names, to_plot_similar_images_names = _get_artists_amd_images_names_from_image_paths_df(initial_similar_images_df)

    # plot.
    plt.figure(figsize = (16, 9))
    plt.subplot(3, 4, 1)
    image = mpimg.imread(search_image_path)
    plt.imshow(image)
    plt.title('Sketch')
    plt.axis('off')

    if len(to_plot_artists_names) > 11:
        plot_count = 11
    else:
        plot_count = len(to_plot_artists_names)
    for similar_image_index in range(plot_count):
        path = os.path.join('arch_100k_dataset', to_plot_artists_names[similar_image_index], to_plot_similar_images_names[similar_image_index])
        print(path)
        image = mpimg.imread(path)
        plt.subplot(3, 4, similar_image_index + 2)
        plt.imshow(image)
        plt.title('Similar Image')
        plt.axis('off')


# initialize model
model = load_model("keras_Resnet50_30")
custom_model = Model(model.inputs, model.layers[-3].output)

# create list of image files in dataset (organized by labels)
root_dir = 'arch_data_sketches/anime_style'
sketches_images_filenames_list = get_file_list(root_dir)

# create image embeddings and store to txt (temporary)
embeddings_storage_dir = 'txt_embeddings_customResnet50_fine'
# this should be commented out most of the time.
# create_images_embeddings_and_store_to_txt(sketches_images_filenames_list, custom_model, embeddings_storage_dir)

# caking pickle file of filenames and features of each files for future references
# extract_embeddings_and_file_names_from_txt(embeddings_storage_dir)

# getting embeddings and embedded filenames (temporary: txt) from pickle files
image_embeddings_and_labels_df = create_image_embeddings_and_labels_df('./embeddings_data/embeddings_sketches_customResnet50_fine.pickle')
print(image_embeddings_and_labels_df)

# create annoy tree
vector_length = len(image_embeddings_and_labels_df['img_embs'][0])
t = AnnoyIndex(vector_length, metric='euclidean')

for i in tqdm(range(len(image_embeddings_and_labels_df['img_embs']))):
    t.add_item(i, image_embeddings_and_labels_df['img_embs'][i])

_ = t.build(100)  # number of trees to build

# find similar images and plot
# similar_images_df = get_similar_images_df_from_index(780, 20)
# show_images('sketch_training_dataset/paintings_sketches_by_artist/Claude Monet/Claude_Monet_2_anime_style.png')
# for s in get_file_list('test_images'):
for path in ['void.jpg', 'light_show.jpg', 'chameleon.png', 'cooper.jpg']:
    show_images(path)
    plt.show()
