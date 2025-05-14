import React, { useState } from "react";
import {assets} from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [price,setPrice] = useState("")
  const [category,setCategory] = useState("Men")
  const [subCategory,setSubCategory] = useState("Men")
  const [bestseller,setBestseller] = useState(false)
  const [sizes,setSizes] = useState([])

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    try{
      if(sizes.length===0){
        toast.error("Atleast one size should be mentioned")
        return
      }

      if((image1 || image2 || image3 || image4)===false){
        toast.error("Atleast one image should be added")
        return
      }
      
      const formData = new FormData()
      
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))
      
      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)
      
      const response = await axios.post(backendUrl+"/api/product/add",formData,{headers:{token}})
      if(response.status === 200){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage1(false)
        setImage1(false)
        setImage1(false)
        setPrice('')
        setSizes([])
        setBestseller(false)
      }
    }
    catch(error){
      if(error.response.status === 400){
        toast.error(error.response.data.message)
      }
      else{
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  return(
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden/>
          </label>

          <label htmlFor="image2">
            <img className="w-20" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden/>
          </label>

          <label htmlFor="image3">
            <img className="w-20" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden/>
          </label>

          <label htmlFor="image4">
            <img className="w-20" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden/>
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2 " type="text" placeholder="Enter product name" required/>
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2 " type="text" placeholder="write content here" required/>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        
        <div>
          <p className="mb-2">Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Men">Heavy-Duty</option>
            <option value="Women">Standard</option>
            <option value="Kids">Compact</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Topwear">High-Torque</option>
            <option value="Bottomwear">Low-Torque</option>
            <option value="Winterwear">Variable-Speed</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price}  className="w-full px-3 py-2 sm:w-[120px]" type="Number" placeholder="price" required />
        </div>

      </div>

      <div>
        <p className="mb-2">Product Hp</p>
        
        <div className="flex gap-3">
          <div onClick={()=>setSizes(prev => prev.includes('15hp') ? prev.filter((item)=> item!='15hp') : [...prev,'15hp'])}>
            <p className={`${sizes.includes('15hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>15hp</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes('20hp') ? prev.filter((item)=> item!='20hp') : [...prev,'20hp'])}>
            <p className={`${sizes.includes('20hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>20hp</p>
          </div>
          <div  onClick={()=>setSizes(prev => prev.includes('25hp') ? prev.filter((item)=> item!='25hp') : [...prev,'25hp'])}>
            <p className={`${sizes.includes('25hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>25hp</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes('30hp') ? prev.filter((item)=> item!='30hp') : [...prev,'30hp'])}>
            <p className={`${sizes.includes('30hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>30hp</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes('35hp') ? prev.filter((item)=> item!='35hp') : [...prev,'35hp'])}>
            <p className={`${sizes.includes('35hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>35hp</p>
          </div>
          <div onClick={()=>setSizes(prev => prev.includes('40hp') ? prev.filter((item)=> item!='40hp') : [...prev,'40hp'])}>
            <p className={`${sizes.includes('40hp') ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>40hp</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller"/>
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">
        ADD
      </button>
    </form>
  )
}

export default Add;