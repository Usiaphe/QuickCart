import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });




// inngest function to  save user data to a database

export const syncUserCreation = inngest.createfunction(
    {
        id: 'sync-user-from-clerk'
    },

    {events: 'clerk/user.created'},

    async (event) =>{
        const { id, firstname, lastname, email_addresses, image_url} = event.data;
        const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            name: firstname + '' + lastname,
            imageUrl: image_url
        }
        await connectDb()
        await User.create(userData);

    }

)

// inngest function to updata user data in database

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    
    {events: 'clerk/user/updated'},
    async({event}) =>{
        const { id, firstname, lastname, email_addresses, image_url} = event.data;
        const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            name: firstname + '' + lastname,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)
    }
)


// inngest function to delete user from database

export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'

    },
    {event: 'clerk/User.deleted'},
    async({event}) => {
       const {id} =event.data

       await connectDB()
       await User.findByIdAndDelete(id)
    }
)