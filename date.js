//module.exports we can refer to it using just exports
exports.getDate = () => {
    
    const today = new Date();
    const options = {
        weekday:"long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    
    return today.toLocaleDateString("en-EN", options);
        
}

exports.getDay = () => {
    
    const today = new Date();
    const options = {
        weekday:"long",
        
    };
    
    return today.toLocaleDateString("en-EN", options);
        
}

exports.getYear = () => {
    
    const today = new Date();

    const optionsFooter = {year: "numeric"};
    
    return today.toLocaleDateString("en-EN", optionsFooter);
}






