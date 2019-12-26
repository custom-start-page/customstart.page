{/* <div class="category">
    <h3>about</h3>
    <div class="category-links">
        <div class="category-link">
            <a href="https://lukas.wolfsteiner.media" data-proofer-ignore>copyright</a>
        </div>
        <div class="category-link">
            <a href="https://travis-ci.com/dotWee/startpage" data-proofer-ignore>travis-ci</a>
        </div>
        <div class="category-link">
            <a href="https://lukas.wolfsteiner.media" data-proofer-ignore>©2019-me</a>
        </div>
        <div class="category-link">
            <a href="https://github.com/dotWee/startpage" data-proofer-ignore>sourcecode</a>
        </div>
    </div>
</div> */}

function createCategory(categoryData) {
    const category = document.createElement('div');
    category.classList.add('category');

    const h3 = document.createElement('h3');
    h3.innerHTML = categoryData.name;

    category.appendChild(h3);

    const categoryLinks = document.createElement('div');
    categoryLinks.classList.add('category-links');

    for (let link of categoryData.links) {
        const categoryLink = document.createElement('div');
        categoryLink.classList.add('category-link');

        const anchor = document.createElement('a');
        anchor.setAttribute('href', link.url);
        anchor.setAttribute('data-proofer-ignore', '');
        anchor.innerHTML = link.name;

        categoryLink.appendChild(anchor);

        categoryLinks.appendChild(categoryLink);
    }

    category.appendChild(categoryLinks);

    return category;
}

function createCategories(data) {
    const categories = document.querySelector('.categories');

    for (let categoryData of data.linkGroups) {
        let category = createCategory(categoryData);

        categories.appendChild(category);
    }
}

new Storage('data-distract').get()
    .then(data => {
        createCategories(data);
    });
