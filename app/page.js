"use client"
import { db, storage } from '@/components/firebaseconfig';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCloudUploadOutline } from "react-icons/io5";


const Page = () => {
  // user collection 
  const userCollection = collection(db, 'users')

  // Get all Users 
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchingData = async () => {
      const res = await getDocs(userCollection);
      setData(res.docs.map((item) => ({ ...item?.data(), id: item?.id })))
    }
    fetchingData();
  }, [])



  // Image Upload 
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState(0);


  //handle change image and preview
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const photo = e.target.files[0];
      setPreview(URL.createObjectURL(photo))
      setImage(photo)
    }
  }






  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !image || !age) {
      toast.error("All field must be required")
      return;
    }

    // image upload 
    const storageRef = ref(storage, `${image.name}`);
    const snapshot = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const storeData = {
      userName,
      age,
      profile: imageUrl
    }

    await addDoc(userCollection, storeData)
      .then(res => {
        toast.success('Student add success');
        setUserName('')
        setAge('');
        setPreview('')
      }).catch(err => {
        toast.error(err?.message);
      })
  }



  //handle remove users 
  const handleRemove = async (id) => {
    const removeRef = doc(db, 'users', id)

    await deleteDoc(removeRef)
      .then(res => {
        toast.success('Student remove success');
      }).catch(err => {
        toast.error(err?.message);
      })

  }



  // handle update method 
  const handleUpdate = async (age, id) => {
    const updateCollection = doc(db, 'users', id);
    const updateAge = { age: parseInt((age + 1)) };

    await updateDoc(updateCollection, updateAge)
      .then(res => {
        toast.success('Student update success !');
      }).catch(err => {
        toast.error(err?.message);
      })


  }



  return (
    <div className='lg:px-24 px-8 py-24'>
      <div className="form my-12 shadow-lg rounded-lg lg:w-1/3 mx-auto p-5">
        <h3 className='font-extrabold text-2xl text-slate-700 mb-5'>Add Student Record</h3>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <input type="text" placeholder='Full Name' value={userName} className='ring-blue-300 px-3 ring-1 py-2 rounded-lg outline-none w-full focus:ring-blue-400 focus:ring-2 placeholder:text-gray-400' onChange={(e) => setUserName(e.target.value)} />
          <input type="number" placeholder='Age' value={age} className='ring-blue-300 px-3 ring-1 py-2 rounded-lg outline-none w-full focus:ring-blue-400 focus:ring-2 placeholder:text-gray-400' onChange={(e) => setAge(e.target.value)} />
          {
            preview ? <Image src={preview} alt="photo" className='object-cover' height={200} width={200} /> :
              <div className="div">
                <label htmlFor="eee">
                  <IoCloudUploadOutline size={50} className='cursor-pointer justify-center mx-auto my-5 text-gray-400' />
                </label>
                <input type="file" id='eee' className='hidden' onChange={handleImageChange} />
              </div>
          }
          <button className='bg-blue-400 p-2 rounded-lg my-5 capitalize text-white text-[16px]'>add student</button>
        </form>
      </div>


      {/* ========== Data show UX ======== */}
      <div className="show-data">
        <h3 className='font-bold text-xl text-blue-500'>Lists of Student : {data?.length}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {
            data?.map((item, index) => {
              const { userName, age, id, profile } = item;
              return (
                <div className="shadow-lg p-3 rounded-lg text-center" key={index}>
                  <Image src={profile} alt="photo" className='object-cover rounded-full h-24 w-24 mx-auto my-5' height={200} width={200} />
                  <h3 className='capitalize font-bold text-[16px] text-slate-600'>Student Name: {userName}</h3>
                  <p className='text-gray-500 my-3 font-semibold'>Age : {age}</p>
                  <div className="flex items-center gap-2 justify-center">
                    <button className='bg-blue-400 text-sm text-white rounded-lg p-2 capitalize' onClick={() => handleUpdate(age, id)}>update</button>
                    <button className='bg-red-400 text-white rounded-lg p-2 text-sm' onClick={() => handleRemove(id)}>Remove</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>



    </div>
  );
};

export default Page;