"use client"

import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import axios from 'axios'
import { io } from 'socket.io-client'

function Votacion({params}) {
    const [votacion,setVotacion]=useState({})
    const [newcandidatodat,setnewCandidatoDat]=useState({
       nombre:null,apellido:null
    })
    const [newname,setNewName]=useState('')
    const [candidatos,setCandidatos]=useState([])
    const [socket,setSocket]=useState(null)
    const [showeditar,setShowEditar]=useState(false)
    useEffect(()=>{

        axios.get(`http://localhost:3002/api/votacion/client?id=${params.id}`,{
            headers:{
                "x-access-token":localStorage.getItem('token')
            }
        }).then(res=>{
            
            setVotacion(res.data)

          
        }).catch(error=>{
            console.log(error);
        })



        const socket=io("http://localhost:3002/user/votaciones",{
            auth:{
                token:localStorage.getItem('token')
            }
           })
           socket.emit("joinRoom",{
            idvotes:params.id,
            candidatos:candidatos
           })
         
           socket.on("error:votar",(data)=>{
              
               console.log(data)
           })
           socket.on("candidato:get",(data)=>{
            console.log(data)
               setCandidatos(data)
           })
           setSocket(socket)

        
        getvotos()
    },[])

    const getvotos = () => {
        setInterval(async()=>{
           let response=await fetch(`http://localhost:3002/api/votacion/client?id=${params.id}`,{
                headers:{
                    "x-access-token":localStorage.getItem('token')
                }
            })
            let data=await response.json()
           
            setVotacion(data)
            
        },5000)
       
    }
  return (
    <div>
   
   <h1 >{votacion.nombre}</h1>
    <div>
        <p>{votacion.descripcion}</p>
    </div>
    <div>
        <p>fecha de inicio: {new Date(votacion.fechaInicio).toLocaleDateString()}</p>
        <p>fecha de fin: {new Date(votacion.fechaFin).toLocaleDateString()}</p>
    </div>
    <div>

        
        
          {
            
            candidatos.map((candidato,index)=>
               <>

              
               
                <h3 key={index} >{candidato.candidato.nombre}  {candidato.candidato.apellido}</h3>
                <h4>total votos:<span>{candidato.votos}</span></h4>
                <button  onClick={()=>{
                    socket.emit("votar:create",votacion.idvotacion,candidato.candidato.idcandidato,localStorage.getItem('token'))
                }}>votar</button>

                </>
                
    )
          }
    </div>

    
       
    </div>
  )
}



export default Votacion