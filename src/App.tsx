import React, { useEffect, useState } from 'react';
import Quest from './components/question'; 
import './App.css';
import NavBar from "./components/NavBar";
import { Box, Image, Input, Spinner } from '@chakra-ui/react';
import defaultImage from './assets/msn.jpg'; 

type QuestionData = { Question: string };  

const App = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);;
  const [isLoading, setIsLoading] = useState(false);
  // const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // State for the image preview URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultImage);
  
  useEffect(() => {
    fetch(defaultImage)
      .then(response => response.blob())
      .then(blob => {
        const imageFile = new File([blob], "msn.jpg", { type: "image/jpeg" });
        setSelectedImage(imageFile);
        setImagePreviewUrl(URL.createObjectURL(imageFile));
        setIsLoading(false)
      });
  }, []);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       setIsLoading(true)
       const file = e.target.files[0];
       setSelectedImage(file);
       setImagePreviewUrl(URL.createObjectURL(file));
       setIsLoading(false)
       
      // setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFormSubmit = (data: QuestionData) => {
    console.log('Form data:', data);
    setIsLoading(true)
   

    // Handle the form data here, including the image if necessary
  };
  
  // if (isLoading) {
  //   return <div className="spinner-container"><Spinner /></div>;
  // }
 

  return (
    <div className="mb-5">
      <NavBar />
      <Box className="image-upload-box" 
           border="1px" 
           borderColor="gray.200" 
           width={["90vw","80vw", "500px"]} // Responsive width: 90% of viewport width on small screens, 500px on larger screens
           height={["90vw","80vw", "500px"]} // Responsive height: keep it square
           margin="auto"  
           overflow="hidden"
      >
          {/* Conditional rendering of Spinner */}
        <Input type="file" onChange={handleImageChange} accept="image/*" />
        {/* Always render Image component */}
        <Image src={imagePreviewUrl}  alt="Selected or default" boxSize="100%" objectFit="cover" />
      </Box>
      {isLoading && <Spinner />}
      <Quest onSubmit={handleFormSubmit} selectedImage={selectedImage} />
    </div>
  );
}

export default App;





// import React, { useState } from 'react';
// import Quest from './components/question'; // Check the file name
// import './App.css';
// import NavBar from "./components/NavBar";
// import { Box, Image, Input } from '@chakra-ui/react';

// type QuestionData = { Question: string };

// const App = () => {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setSelectedImage(file);
//       setImagePreviewUrl(URL.createObjectURL(file)); // Generate the URL for preview
//     }
//   };

//   const handleFormSubmit = (data: QuestionData) => {
//     console.log('Form data:', data);
//     // Handle form submission, potentially including the selectedImage file
//   };

//   return (
//     <div className="mb-5">
//       <NavBar />
//       <Box className="image-upload-box" border="1px" borderColor="gray.200" padding="20px" maxWidth="500px" margin="auto">
//         <Input type="file" onChange={handleImageChange} accept="image/*" />
//         {imagePreviewUrl && (
//           <Box margin="20px 0" maxWidth="100%">
//             <Image src={imagePreviewUrl} alt="Selected" boxSize="100%" objectFit="contain" />
//           </Box>
//         )}
//       </Box>
      
//       <Quest onSubmit={handleFormSubmit} selectedImage={imagePreviewUrl} />
//     </div>
//   );
// }

// export default App;

