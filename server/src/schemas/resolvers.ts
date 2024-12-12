import { signToken, AuthenticationError } from '../utils/auth.js';
import User  from "../models/User.js";
import { Types } from "mongoose";

interface User {
    _id: Types.ObjectId | null | string;
    username: string;
    email: string;
}

interface Context {
    user?: User;
}

interface SaveBookArgs {
    saveBookInput: {
        bookId: string;
        title: string;
        authors: [string];
        description: string;
        image: string;
        link: string; 
    };
}

const resolvers = {
    Query: {
        sayHello: () => "Hello from GraphQL",
        me: async (_parent: any, _args: any, context: Context) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id })
                return user;
            }
            throw AuthenticationError;
        },
    },

    Mutation: {

        login: async ( _parent: any, { email, password }: { email: string; password: string } ) => {
 
            const user = await User.findOne({ email });
            
            if(!user) throw AuthenticationError;

            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) throw new AuthenticationError('Not Authenticated');

            // Sign a JWT token for the authenticated profile
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        addUser: async (_parent: any, args: any ) => {
            const user = await User.create(args);
            const token = signToken(
                user.username,
                user.email,
                user._id as Types.ObjectId
            );
            return { token, user };
        },

        saveBook: async( _parent: any, { saveBookInput }: SaveBookArgs, context: Context ) => {
            
            if (context.user) {
    
                
                //const book = await Book.create({ ...saveBookInput });
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks:saveBookInput} },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }

            throw new AuthenticationError('Could not find user');
        },

        removeBook: async( _parent: any, { bookId } : {bookId:string} , context: Context  ) => {
            
            if (context.user) {
                
                //return await Book.findOneAndDelete({ bookId: bookId });
                const data = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return data;

            }

            throw new AuthenticationError('Could not find user');
        },

    },
};

export default resolvers;
