//update data
import { showAlert } from "./alert.js";
export const updateSettings=async(data,type)=>{
    // type is either 'password' or 'data'
    try{
        const url=type==='password'?'http://127.0.0.1:8000/api/v1/users/updateMyPassword':'http://127.0.0.1:8000/api/v1/users/updateMe'
        const res=await axios({
            method:'PATCH',
            url,
            data
        });
        if(res.data.status==='success'){
            showAlert('success',`${type.toUpperCase()} Data updated successfully`);
        }
    }catch(err){
           console.log(err+"nono")
        // console.log(err.response);
        showAlert('error',err.response.data.message);
     
    }
}


const fileInput = document.getElementById("photo");
const image = document.querySelector(".form__user-photo");
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        image.src = event.target.result;
       
    };
    console.log(image.src);

    reader.readAsDataURL(file);
});
  

const userDataForm=document.querySelector('.form-user-data');
if(userDataForm){
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault();
        const form=new FormData();
        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);
        updateSettings(form,'data');
    })
}


// password update
const userPasswordForm=document.querySelector('.form-user-password');
if(userPasswordForm){
    userPasswordForm.addEventListener('submit',async e=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent='Updating...';
        const passwordCurrent=document.getElementById('password-current').value;
        const password=document.getElementById('password').value;
        const passwordConfirm=document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent,password,passwordConfirm},'password');
        document.querySelector('.btn--save-password').textContent='SAVE PASSWORD';
        document.getElementById('password-current').value='';
        document.getElementById('password').value='';
        document.getElementById('password-confirm').value='';
    });
}