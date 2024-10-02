

export const invalidInputSwal = (text) => {
  swal({
    title: 'Invalid input', 
    text, 
    icon: 'error'
  });
};