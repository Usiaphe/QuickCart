import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    { events: ["clerk/user.created"] },
    async (event) => {
        const { id, firstname, lastname, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${firstname} ${lastname}`,
            imageUrl: image_url,
        };

        await connectDb();
        await User.create(userData);
    }
);

// Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk",
    },
    { events: ["clerk/user.updated"] },
    async (event) => {
        const { id, firstname, lastname, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${firstname} ${lastname}`,
            imageUrl: image_url,
        };

        await connectDb();
        await User.findByIdAndUpdate(id, userData);
    }
);

// Inngest function to delete user from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk",
    },
    { events: ["clerk/user.deleted"] },
    async (event) => {
        const { id } = event.data;

        await connectDb();
        await User.findByIdAndDelete(id);
    }
);
