import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const API_ENDPOINT = 'http://localhost:5000/query';

const schema = z.object({
  Question: z.string().min(3, { message: 'Question should be at least 3 characters.' }).max(150),
});

export type questionData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: questionData) => void;
  selectedImage: File | null;  // Add the selectedImage prop
}

const Quest: React.FC<Props> = ({ onSubmit, selectedImage }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<questionData>({
    resolver: zodResolver(schema),
  });
  const [serverResponse, setServerResponse] = useState('');

  const submitForm = async (data: questionData) => {
    try {
      const formData = new FormData();
      formData.append('question', data.Question);
      
      // Add the image to formData if it exists
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setServerResponse(response.data.answer);
     // reset();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <label htmlFor="Question" className="form-label">Question</label>
          <input {...register('Question')} id="Question" defaultValue={'who are in the photo?'} type="text" className="form-control"></input>  
          {errors.Question && <p className='text-danger'>{errors.Question.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
      {serverResponse && <div className="mt-3"><strong>Server Response:</strong><p>{serverResponse}</p></div>}
    </>
  );
};

export default Quest;
