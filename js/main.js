"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    Emina Abazovic - 2026-06-22
 *  *******************************************************/

import { User } from "./class.user.js";
import { Post } from "./class.post.js";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const state = {
    users: [],
};

document.addEventListener("DOMContentLoaded", () => {
    initApp().catch((error) => {
        showStatus(`Something went wrong: ${error.message}`, true);
    });
});

async function initApp() {
    const usersContainer = getUsersContainer();

    usersContainer.addEventListener("click", handleUsersClick);

    showStatus("Loading users and posts...");
    state.users = await loadUsersWithPosts();
    renderUsers();
    showStatus(`Loaded ${state.users.length} users. Click a user to expand their posts.`);
}

async function loadUsersWithPosts() {
    const [usersData, postsData] = await Promise.all([
        fetchJson("/users"),
        fetchJson("/posts"),
    ]);

    const users = usersData.map((userData) => new User(userData));
    const usersById = new Map(users.map((user) => [user.id, user]));

    postsData.forEach((postData) => {
        const user = usersById.get(postData.userId);

        if (user) {
            user.addPost(new Post(postData));
        }
    });

    return users;
}

async function fetchJson(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}

function renderUsers() {
    const usersContainer = getUsersContainer();
    usersContainer.replaceChildren();

    state.users.forEach((user) => {
        usersContainer.append(user.render());
    });
}

async function handleUsersClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;

    if (action === "toggle-user") {
        toggleUserPosts(button);
        return;
    }

    if (action === "load-comments") {
        await loadPostComments(button);
        return;
    }

    if (action === "toggle-comments") {
        toggleComments(button);
    }
}

function toggleUserPosts(button) {
    const userCard = button.closest("[data-user-card]");
    const postsContainer = userCard.querySelector(".posts");
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const shouldExpand = !isExpanded;

    postsContainer.hidden = !shouldExpand;
    userCard.classList.toggle("is-expanded", shouldExpand);
    button.setAttribute("aria-expanded", String(shouldExpand));
    button.textContent = shouldExpand
        ? "Hide posts"
        : `Show ${postsContainer.querySelectorAll(".post-card").length} posts`;
}

async function loadPostComments(button) {
    const postId = Number(button.dataset.postId);
    const post = findPostById(postId);
    const postCard = button.closest("[data-post-card]");
    const commentsContainer = postCard.querySelector(".comments");

    if (!post) {
        commentsContainer.textContent = "Could not find this post.";
        commentsContainer.hidden = false;
        return;
    }

    button.disabled = true;
    button.textContent = "Loading comments...";

    try {
        const comments = await fetchJson(`/comments?postId=${postId}`);
        post.setComments(comments);

        commentsContainer.replaceChildren(post.renderComments());
        commentsContainer.hidden = false;

        button.dataset.action = "toggle-comments";
        button.disabled = false;
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Hide comments";
    } catch (error) {
        commentsContainer.textContent = `Could not load comments: ${error.message}`;
        commentsContainer.hidden = false;
        button.disabled = false;
        button.textContent = "Try again";
    }
}

function toggleComments(button) {
    const postCard = button.closest("[data-post-card]");
    const commentsContainer = postCard.querySelector(".comments");
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const shouldExpand = !isExpanded;

    commentsContainer.hidden = !shouldExpand;
    button.setAttribute("aria-expanded", String(shouldExpand));
    button.textContent = shouldExpand ? "Hide comments" : "Show comments";
}

function findPostById(postId) {
    return state.users
        .flatMap((user) => user.posts)
        .find((post) => post.id === postId);
}

function getUsersContainer() {
    return document.querySelector("#users");
}

function showStatus(message, isError = false) {
    const statusElement = document.querySelector("#status");

    statusElement.textContent = message;
    statusElement.classList.toggle("status--error", isError);
}