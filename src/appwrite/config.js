import conf from "../conf/conf";
import { Client, Databases, Account, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(conf.appwriteUrl) 
    .setProject(conf.appwriteProjectId);           

export const databases = new Databases(client);
export const account = new Account(client);
export { ID, Query };

export default client;