import { databases } from '../lib/appwrite';
import { Query } from 'appwrite';

//fetch user image if already uploaded

export const fetchUserImage = async (userForImage) => {
    const response = await databases.listDocuments(
      '67455f1a0025877bd7ef',
      '6746b723000a80a9b608',
      [Query.equal('userId', userForImage)], 
   );
   const userData = response.documents[response.documents.length - 1]
   if(userData){
    localStorage.setItem('userImage', userData?.imageId 
        ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/6746b8ed0001f0182f68/files/${userData.imageId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
        : null);
   }
}