
import { showAlert } from "./alert.js";
const login=async(email,password)=>{
    try{
        const res=await axios({
            method:'POST',
            url:'http://127.0.0.1:8000/api/v1/users/login',
            data:{
                email,
                password
            },     
        withCredentials: true
        });
        if(res.data.status==='success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
    console.log(res);
    }catch(err){
       showAlert('error',err.response.data.message)
       console.log(err)
    }    
}

const loginForm=document.querySelector('.form--login');
if(loginForm){
        loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password);
    })
}
  
const logOutBtn=document.querySelector('.nav__el--logout');
export const logout=async()=>{
    try{
        const res=await axios({
            method:'GET',
            url:'http://127.0.0.1:8000/api/v1/users/logout',

        });
        if(res.data.status='success'){
            // location.reload(true)
              location.href='/';
        }
    }catch(err){
        showAlert('error','Error logging out, Try again')
    }
}

if(logOutBtn){
    logOutBtn.addEventListener("click",logout);
}