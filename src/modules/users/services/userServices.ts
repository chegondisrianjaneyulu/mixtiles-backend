import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import AppleAuth from "apple-auth";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

interface User {
   email: string;
   id: number;
}

class UserService {
    #googleClient
    #appleAuth

    constructor() {
        this.#googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        this.#appleAuth = new AppleAuth(
            {
              client_id: process.env.APPLE_CLIENT_ID as string,
              team_id: process.env.APPLE_TEAM_ID as string,
              key_id: process.env.APPLE_KEY_ID as string,
              redirect_uri: process.env.APPLE_REDIRECT_URI as string,
              scope: "name email", 
            },
            process.env.APPLE_PRIVATE_KEY as string,
            "text"
        );
    }

    async authenticateUser(body:any) {
       const { email, password, googleToken, appleToken, } = body;
       let user;
       
        if (googleToken) {
            user = await this.#handleGoogleLogin(googleToken)
        }else if (appleToken) {
            user = await this.#handleAppleLogin(appleToken)
        }else if (email && password) {
            user = await this.#handleEmailPasswordLogin(email, password);
        }else {
         throw new Error('Invalid Request')
        }

       const token = this.#generateJwtToken(user);
       return {token, user}
    }

    async getAllUsers() {
      return await prisma.user.findMany({});
    }

    async getUserById(id: string) {
        return await prisma.user.findUnique({where: {id: +id}})
    }

    async createUser( data : any ) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.create({ data });
    }

    async updateUser( id:number, data : any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.update({
            where: { id,  },
            data,
        });
    }

    async deleteUser( id: number ) {
      return prisma.user.update({where : {id}, data: {is_deleted: 1}})
    }

    #generateJwtToken(user:User) {
        return jwt.sign({userId:user.id, email: user.email}, JWT_SECRET as string, { expiresIn: "7d" })
    }

    async #findOrCreateUser(email:string, userData:any) {
        let user = await prisma.user.findUnique({ where: { email } });
        
        if ( !user ) {
            user = await prisma.user.create({data: userData,});
        }

        return user;
    }

    async #handleGoogleLogin(googleToken: string) {
        const ticket = await this.#googleClient.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID});
        const payload = ticket.getPayload();

        if ( payload ) {
            const email = payload.email!;
            return this.#findOrCreateUser(email, { first_name: payload?.given_name, last_name: payload?.family_name, email,  password: "", })
        }
        
        throw new Error('Something went wrong')
       
    }

    async #handleAppleLogin(appleToken: string) {
        const response = await this.#appleAuth.accessToken(appleToken);

        const decodedToken = jwt.decode(response.id_token) as { email?: string };

        if ( !decodedToken?.email ) {
        throw new Error("Apple login did not provide an email address.");
    }

    return this.#findOrCreateUser(decodedToken.email, { email: decodedToken.email });
    }

    async #handleEmailPasswordLogin(email: string, password:string) {
        let user = await prisma.user.findUnique({where: { email }})
        if ( !user ) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await prisma.user.create({
                data: { email, password: hashedPassword },
            });
        } else {
            if (user.password) {
                const validatePassword = await bcrypt.compare(password, user.password);
                if (!validatePassword) {
                    throw new Error("Invalid Credentials");
                }
            }
        }    
        return user;
    }
}

export const userService = new UserService()