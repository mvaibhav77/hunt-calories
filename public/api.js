class Nutrition{
    async getNutrients(name){
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'e5648c18e2msh101eed599cac488p1aa374jsnc2d3358fd671',
                'X-RapidAPI-Host': 'nutritionix-api.p.rapidapi.com'
            }
        };
        
        const apiRes= await fetch(`https://nutritionix-api.p.rapidapi.com/v1_1/search/${name}?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat`, options);
        const response = await apiRes.json();
        return response.hits;
    }
}
