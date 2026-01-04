
async function FetchUser({ email }) {
    try{
        const response = await fetch(`https://vacagest.onrender.com/api/user/getUser/${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json()
          return data
    }catch(err){
        console.error(err);
    }
}

export default FetchUser