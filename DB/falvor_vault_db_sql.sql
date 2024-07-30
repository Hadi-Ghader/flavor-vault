CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE categories(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) UNIQUE NOT NULL
);

CREATE INDEX idx_categories_name ON categories(name);

CREATE TABLE recipes(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
	user_id INT NOT NULL,
	category_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_recipes_title ON recipes(title);
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_category_id ON recipes(category_id);

CREATE TABLE comments(
	id SERIAL PRIMARY KEY,
	body TEXT NOT NULL,
	user_id INT NOT NULL,
	recipe_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);

CREATE TABLE ratings(
	id SERIAL PRIMARY KEY,
	stars_count INT NOT NULL,
	user_id INT NOT NULL,
	recipe_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT stars_count_check CHECK (stars_count >= 1 AND stars_count <= 5),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE INDEX idx_user_id ON ratings (user_id);
CREATE INDEX idx_recipe_id ON ratings (recipe_id);

CREATE TABLE likes(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	recipe_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_recipe_id ON likes(recipe_id);

CREATE TABLE favorites(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	recipe_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_recipe_id ON favorites(recipe_id);

CREATE TABLE recipe_edits(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	body TEXT NOT NULL,
	approved BOOLEAN,
	user_id INT NOT NULL,
	recipe_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	approved_at TIMESTAMP,
	FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_recipe_edits_user_id ON recipe_edits (user_id);
CREATE INDEX idx_recipe_edits_recipe_id ON recipe_edits (recipe_id);