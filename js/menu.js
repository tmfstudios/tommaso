const MENU_URL = "https://menu.tommasoinbrooklyn.com/menu.json";

async function loadMenu() {
    const container = document.getElementById("restaurant-menu");

    try {
        const response = await fetch(MENU_URL);

        if (!response.ok) {
            throw new Error("Could not load menu");
        }

        const menu = await response.json();

        container.innerHTML = "";

        menu.categories.forEach(category => {
            const categoryElement = document.createElement("section");
            categoryElement.className = "menu-category";

            categoryElement.innerHTML = `
                <h2>${escapeHTML(category.name)}</h2>
                ${category.description
                    ? `<p>${escapeHTML(category.description)}</p>`
                    : ""}
            `;

            category.items.forEach(item => {
                if (!item.available) return;

                const itemElement = document.createElement("article");
                itemElement.className = "menu-item";

                const tags = Array.isArray(item.dietary_tags)
                    ? item.dietary_tags
                        .map(tag =>
                            `<span class="dietary-tag">${escapeHTML(tag)}</span>`
                        )
                        .join("")
                    : "";

                itemElement.innerHTML = `
                    ${item.image_url
                        ? `<img src="${escapeHTML(item.image_url)}"
                                alt="${escapeHTML(item.name)}"
                                loading="lazy">`
                        : ""
                    }

                    <div class="menu-item-info">
                        <div class="menu-item-heading">
                            <h3>${escapeHTML(item.name)}</h3>
                            <span class="price">$${escapeHTML(item.price)}</span>
                        </div>

                        ${item.description
                            ? `<p>${escapeHTML(item.description)}</p>`
                            : ""
                        }

                        <div class="dietary-tags">
                            ${tags}
                        </div>
                    </div>
                `;

                categoryElement.appendChild(itemElement);
            });

            if (categoryElement.querySelector(".menu-item")) {
                container.appendChild(categoryElement);
            }
        });

    } catch (error) {
        console.error(error);
        container.innerHTML =
            "<p>Menu is temporarily unavailable.</p>";
    }
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadMenu);
