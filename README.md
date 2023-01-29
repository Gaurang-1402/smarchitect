## Inspiration 💡
Architects are constantly inspired by existing buildings, but searching for these buildings is a tedious, time-consuming, and expensive process. Humans are naturally wired to remember visual memories rather than names of certain buildings or architectural designs. Architects can draw what they have in memory to remember but this does not directly help them in the research process because they can't use it to look up the original image and the drawing is not as good as the real sight they saw. 

The average architecture atlas (a book of designs) easily costs >$100 – architects either have to fork out the money to buy several of these for themselves or spend time and energy visiting archives and libraries in person.

Sometimes architects intuitively have a burst of creativity as to what they want to design and sketch it on their notepads but find it tedious to use complicated rendering software to see the realistic images of their idea.  With architecture schools putting a high emphasis on UN sustainability goals in their teachings and offering specific courses for energy efficiency, students need better exposure to modern architecture that has creatively tackled these problems.

This research and execution process is very inefficient and interferes in the creative insights of architects. 

With Smarchitect, we're democratizing the research and generative process for architects everywhere. **We've just created a search engine and a generative model for architecture.**

[![no-google.png](https://i.postimg.cc/bvNLYKRy/no-google.png | width=1)](https://postimg.cc/PC912Vc9)

## What it does 🤔
Smarchitect allows architects to search for real-world buildings from just a sketch. Users can choose to either upload a sketch (from paper) or draw one on the spot using our in-browser sketch interface. We've all heard of applications offering text-->img, speech-->text, text-->speech, etc. We have innovated and built one of the first

**sketch-->image** application,

This is a new paradigm of generative AI where our rough, rudimentary sketches become high fidelity images! 

Ideas, thoughts, and feelings our languages can't convey can be conveyed through our drawing which can be further refined by AI.


[![demo.png](https://i.postimg.cc/26StJ1tx/demo.png)](https://postimg.cc/CZ9JnxSZ)


## How we built it ⚙️

When a user uploads or creates a sketch, we first convert their sketch to an embedding using Resnet50. Then, using an approximate nearest neighbor search, we find embeddings that are similar to their sketch (which we previously converted from a database of real-world images). After identifying embeddings, we retrieve similar images from our database and finally display those images to our users. On clicking each search result, users are directed to their respective project page on Arch Daily. The generative AI part is done using the Stable Diffusion model which was fine-tuned for our architectural needs.

[![flowchart.png](https://i.postimg.cc/BQrd6Q8q/flowchart.png)](https://postimg.cc/8jbyXGB3)

## Relevant Research 📚
Our project was inspired by this novel paper[https://arxiv.org/abs/2203.12691](MIT project and paper) on the conversion of images to line drawings while preserving geometry and depth. We use this method to more accurately compare sketches with our database of images.

- [https://www.kaggle.com/datasets/tompaulat/modernarchitecture?resource=download](https://www.kaggle.com/datasets/tompaulat/modernarchitecture?resource=download "https://www.kaggle.com/datasets/tompaulat/modernarchitecture?resource=download")
- [https://www.archdaily.com/office](https://www.archdaily.com/office "https://www.archdaily.com/office")
- [https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-component](https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-component "https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-component")
- [https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-api-and-main-react-hooks](https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-api-and-main-react-hooks "https://www.newline.co/courses/newline-guide-to-painting-on-canvas-with-react/canvas-api-and-main-react-hooks")
- [https://www.programonaut.com/create-a-drawing-app-with-html-and-javascript/](https://www.programonaut.com/create-a-drawing-app-with-html-and-javascript/ "https://www.programonaut.com/create-a-drawing-app-with-html-and-javascript/")
- 1.  Rombach, Robin, et al. "High-resolution image synthesis with latent diffusion models." Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2022.
- 2.  Saharia, Chitwan, et al. "Palette: Image-to-image diffusion models." ACM SIGGRAPH 2022 Conference Proceedings. 2022.

## Challenges we ran into 😤

A sketch-to-search application has not existed before. Fine-tuning our project to provide useful searches and return accurate results also involved a lot of trial and error. Finally, we also expended a significant amount of effort to genuinely understand our users' problems and whether our search-from-sketch and generative use cases would be of any use.


## What we learned 🙌
We learned the importance of robustness and accuracy in image parsing and matching algorithms. We also learned the value of a user-centered design approach, as this helped us ensure that our tool was practical and useful for architects.

[![team.png](https://i.postimg.cc/WbFBTJ1W/team.png)](https://postimg.cc/mt4XSkMC)

## What's next? 🚀
We plan to continue improving Smarchitect by expanding our dataset to more architectural images (for example, technical drawings) and refining the search algorithm. We can also add filtering by labels (for example, architectural features or structures), to make the tool even more practical to everyday work.

## Best Climate Hack🍀
We significantly cut down on the amount of paper used to print physical atlases of architectural images and the need for architects to travel to physical libraries, reducing emissions and resource consumption. In all of our generative images, **we provide climate change, sustainability, environmentalism, and energy conservation as stylistic prompts** which means that the resultant inspirations take into account architectural principles about nature and influence the architectures of tomorrow to consider them strongly too!

## Best Accessibility Hack👨🏻‍🦯
Many architects, due to geographical location or income, don't have access to high-quality libraries or the funds to purchase expensive architecture atlases. By democratizing the search for architectural inspiration, we hope to eliminate location and cost as limiting factors.

## Best Domain Name⭐
We registered the domain name smarchi.tech, which smartly fits phonetically with our project name.
