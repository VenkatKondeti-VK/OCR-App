const formatText = (rawText) => {
    const lines = rawText.split('\n');
    console.log(lines)
    
    let id,name,lastName,dob,expiry,issue
    id = lines[1];

    const regex_name = new RegExp('Name*');
    const regex_last = new RegExp('Last Name*', 'i');
    const regex_birth = new RegExp('Date of Birth*', 'i');
    const regex_issue = new RegExp('Date of Issue*', 'i');
    const regex_expiry = new RegExp('Date of Expiry*', 'i');


    for(let i=0;i<lines.length;i++){
        if(lines[i].match(regex_last)){
            if(lines[i].length > 10){
                lastName = lines[i].slice(10)
            }
            else{
                lastName = lines[i+1];
            }
        }
        else if(lines[i].match(regex_name)){
            if(lines[i].length > 5){
                name = lines[i].slice(5)
            }
            else{
                name = lines[i+1];
            }
        }
        
        else if(lines[i].match(regex_birth)){
            if(lines[i].length > 14){
                dob = lines[i].slice(14)
            }
            else{
                dob = lines[i+1];
            }
        }
        else if(lines[i].match(regex_issue)){
            issue = lines[i-1];
        }
        else if(lines[i].match(regex_expiry)){
            expiry = lines[i-1];
        }
    }

    const formattedText = {
        id,
        name,
        lastName,
        dob,
        issue,
        expiry,
    }
    console.log(formattedText)

    return formattedText
}

export default formatText