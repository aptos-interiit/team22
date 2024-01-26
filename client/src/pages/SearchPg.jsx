// Purpose: Search Functionality logic
const SearchPg = (array,word) => {
    const searchTerm = word.toLowerCase()
  return array.filter(value=>{
    return value.title.toLowerCase().match(new RegExp(searchTerm, 'g'))
  }) 
}
export default SearchPg