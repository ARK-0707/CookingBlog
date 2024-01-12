require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage
 */


exports.homepage = async(req,res) => {
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

        const food = { latest, thai, chinese, american};


        res.render('index', { title: 'CookingBlog - Home', categories, food } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET /categories
 * Categories
 */


exports.exploreCategories = async(req,res) => {
    try {

        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'CookingBlog - Categories', categories } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET /categories/:id
 * Categories by Id
 */

exports.exploreCategoriesById = async(req,res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', { title: 'CookingBlog - Categories', categoryById } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}




/**
 * GET /recipe/id
 * Recipe
 */


exports.exploreRecipe = async(req,res) => {
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'CookingBlog - Recipe', recipe } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * POST / search
 * Search
 */
exports.searchRecipe = async(req,res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'CookingBlog - Search', recipe } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}




/**
 * GET /explore-latest
 * Explore Recipes
 */
exports.exploreLatest = async(req,res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', { title: 'CookingBlog - Explore Latest', recipe } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}

/**
 * GET /explore-random
 * Explore Random
 */
exports.exploreRandom = async(req,res) => {
    try {

        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', { title: 'CookingBlog - Explore Random', recipe } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}



/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async(req,res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'CookingBlog - Submit Recipe', infoErrorsObj, infoSubmitObj } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async(req,res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;
        
        if(!req.files || Object.keys(req.files).length === 0) {
            console.log('no files to upload');
        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            });
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been added.');
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }    
}




/*
async function deleteRecipe(){

    try {
        await Recipe.deleteOne({ name: 'New chocolate cake' });
    } catch (error) {
        console.log(error);
    }
}

deleteRecipe();

*/

/*
async function updateRecipe(){

    try {
        const res = await Recipe.updateOne({ name: 'ARK' }, { name: 'ARK: Survival Evolved' });
        res.n;
        res.nModified;
    } catch (error) {
        console.log(error);
    }
}

updateRecipe();

*/



/*
async function insertDummyCategoryData(){


    try{
        await Category.insertMany([
            {
                "name": "Thai",
                "image": "thai-food.jpg"
            },
            {
                "name": "American",
                "image": "american-food.jpg"
            },
            {
                "name": "Chinese",
                "image": "chinese-food.jpg"
            },
            {
                "name": "Mexican",
                "image": "mexican-food.jpg"
            },
            {
                "name": "Indian",
                "image": "indian-food.jpg"
            },
            {
                "name": "Spanish",
                "image": "spanish-food.jpg"
            }
        ]);
    } catch(error){
        console.log('err', + error);
    }
}

insertDummyCategoryData();
*/





/*
async function insertDummyRecipeData(){


    try{
        await Recipe.insertMany([
            {
                "name": "Thai pinched salad",
                "description": `Peel and very finely chop the ginger and deseed and finely slice the chilli (deseed if you like). Toast the sesame seeds in a dry frying pan until lightly golden, then remove to a bowl.
                Mix the prawns with the five-spice and ginger, finely grate in the lime zest and add a splash of sesame oil. Toss to coat, then leave to marinate.
                Trim the lettuces, discarding any tatty outer leaves, then click the leaves apart. Pick out 12 nice-looking inner leaves (save the remaining lettuce for another recipe).
                Cook the noodles according to the packet instructions, then drain and toss in a little sesame oil. Leave to cool, then squeeze over the lime juice.
                Scatter over the chilli and sesame seeds, then pick over the coriander leaves. Mix well.
                Stir-fry the marinated prawns in a hot wok or frying pan over a high heat for 2 to 3 minutes, or until just cooked. Remove to a plate.
                
                Source: https://www.jamieoliver.com/recipes/seafood-recipes/asian-pinch-salad/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "5 cm piece of ginger",
                    "1 fresh red chilli",
                    "25 g sesame seeds",
                    "24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
                    "1 pinch Chinese five-spice powder",
                    "1 lime",
                    "sesame oil",
                    "2 round lettuces",
                    "50 g fine rice noodles",
                    "½ a bunch of fresh coriander (15g)"
                ],
                "category": "Thai",
                "image": "thai-chinese-inspired-pinch-salad.jpg"
            },
            {
                "name": "Thai green curry",
                "description": `Preheat the oven to 180ºC/350ºF/gas 4.
                Wash the squash, carefully cut it in half lengthways and remove the seeds, then cut into wedges. In a roasting tray, toss with 1 tablespoon of groundnut oil and a pinch of sea salt and black pepper, then roast for around 1 hour, or until tender and golden.
                For the paste, toast the cumin seeds in a dry frying pan for 2 minutes, then tip into a food processor.
                Peel, roughly chop and add the garlic, shallots and ginger, along with the kaffir lime leaves, 2 tablespoons of groundnut oil, the fish sauce, chillies (pull off the stalks), coconut and most of the coriander (stalks and all).
                Bash the lemongrass, remove and discard the outer layer, then snap into the processor, squeeze in the lime juice and blitz into a paste, scraping down the sides halfway.
                
                Source: https://www.jamieoliver.com/recipes/butternut-squash-recipes/thai-green-curry/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "1 butternut squash (1.2kg)",
                    "groundnut oil",
                    "2x 400 g tins of light coconut milk",
                    "400 g leftover cooked greens, such as Brussels sprouts, Brussels tops, kale, cabbage, broccoli",
                    "350 g firm silken tofu",
                    "75 g unsalted peanuts",
                    "sesame oil",
                    "1 fresh red chilli",
                    "2 limes",
                    "1 teaspoon cumin seeds",
                    "2 cloves garlic",
                    "2 shallots",
                    "5 cm piece of ginger",
                    "4 lime leaves",
                    "2 tablespoons fish sauce",
                    "4 fresh green chillies",
                    "2 tablespoons desiccated coconut",
                    "1 bunch fresh coriander (30g)",
                    "1 stick lemongrass",
                    "1 lime"
                ],
                "category": "Thai",
                "image": "thai-green-curry.jpg"
            },
            {
                "name": "Thai vegetable broth",
                "description": `Peel and crush the garlic, then peel and roughly chop the ginger. Trim the greens, finely shredding the cabbage, if using. Trim and finely slice the spring onions and chilli. Pick the herbs.
                Bash the lemongrass on a chopping board with a rolling pin until it breaks open, then add to a large saucepan along with the garlic, ginger and star anise.
                Place the pan over a high heat, then pour in the vegetable stock. Bring it just to the boil, then turn down very low and gently simmer for 30 minutes.
                A couple of minutes before it’s cooked, throw in your Asian veggies and gently cook until they are wilted but still crunchy.
                Serve the broth in deep bowls seasoned with fish sauce (if using) and soy sauce, sprinkle with the herbs, cress, spring onion and chilli, then serve with wedges of lime.
                
                Source: https://www.jamieoliver.com/recipes/vegetables-recipes/asian-vegetable-broth/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "3 cloves of garlic",
                    "5cm piece of ginger",
                    "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
                    "2 spring onions",
                    "1 fresh red chilli",
                    "5 sprigs of fresh Thai basil",
                    "1 stick of lemongrass",
                    "2 star anise",
                    "800 ml clear organic vegetable stock",
                    "1 teaspoon fish sauce , (optional)",
                    "1 teaspooon soy sauce",
                    "1 small punnet shiso cress",
                    "1 lime"
                ],
                "category": "Thai",
                "image": "thai-inspired-vegetable-broth.jpg"
            },
            {
                "name": "Thai red chicken soup",
                "description": `Sit the chicken in a large, deep pan.
                Carefully halve the squash lengthways, then cut into 3cm chunks, discarding the seeds.
                Slice the coriander stalks, add to the pan with the squash, curry paste and coconut milk, then pour in 1 litre of water. Cover and simmer on a medium heat for 1 hour 20 minutes.
                Use tongs to remove the chicken to a platter. Spoon any fat from the surface of the soup over the chicken, then sprinkle with half the coriander leaves.
                Serve with 2 forks for divvying up the meat at the table. Use a potato masher to crush some of the squash, giving your soup a thicker texture.
                Taste, season to perfection with sea salt and black pepper, then divide between six bowls and sprinkle with the remaining coriander.
                Shred and add chicken, as you dig in.
                
                Source: https://jamieoliver.com/recipes/chicken-recipes/thai-red-chicken-soup/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "1 x 1.6 kg whole chicken",
                    "1 butternut squash (1.2kg)",
                    "1 bunch of fresh coriander (30g)",
                    "100 g Thai red curry paste",
                    "1 x 400 ml tin of light coconut milk"
                ],
                "category": "Thai",
                "image": "thai-red-chicken-soup.jpg"
            },
            {
                "name": "Thai style mussels",
                "description": `Wash the mussels thoroughly, discarding any that aren’t tightly closed.
                Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.
                In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.
                Add the coconut milk and fish sauce and bring to the boil, then add the mussels and cover the pan.
                Steam the mussels for 5 minutes, or until they've all opened and are cooked. Discard any unopened mussels.
                Finish with a squeeze of lime juice, then sprinkle with coriander leaves and the remaining chilli to serve.
                
                Source: https://www.jamieoliver.com/recipes/seafood-recipes/thai-style-mussels/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "1 kg mussels , debearded, from sustainable sources",
                    "4 spring onions",
                    "2 cloves of garlic",
                    "½ a bunch of fresh coriander",
                    "1 stick of lemongrass",
                    "1 fresh red chilli",
                    "groundnut oil",
                    "1 x 400 ml tin of reduced fat coconut milk",
                    "1 tablespoon fish sauce",
                    "1 lime"
                ],
                "category": "Thai",
                "image": "thai-style-mussels.jpg"
            },
            {
                "name": "Tom daley",
                "description": `Drain the juices from the tinned fruit into a bowl, add the soy and fish sauces, then whisk in 1 teaspoon of cornflour until smooth. Chop the pineapple and peaches into bite-sized chunks and put aside.
                Pull off the chicken skin, lay it flat in a large, cold frying pan, place on a low heat and leave for a few minutes to render the fat, turning occasionally. Once golden, remove the crispy skin to a plate, adding a pinch of sea salt and five-spice.
                Meanwhile, slice the chicken into 3cm chunks and place in a bowl with 1 heaped teaspoon of five-spice, a pinch of salt, 1 teaspoon of cornflour and half the lime juice. Peel, finely chop and add 1 clove of garlic, then toss to coat.
                Next, prep the veg: trim and roughly slice the asparagus and broccoli at an angle, leaving the pretty tips intact. Peel the onion, cut into quarters and break apart into petals, then peel the remaining clove of garlic and finely slice with the chillies. Deseed and roughly chop the peppers, then peel and matchstick the ginger.
                Place the frying pan on a high heat and cook the chicken for 5 to 6 minutes, or until golden and cooked through, turning halfway, then leave on a low heat.
                Meanwhile, place a wok on a high heat and scatter in the pepper and onion to scald and char for 5 minutes. Add 1 tablespoon of oil, followed by the peaches, pineapple, ginger, garlic, most of the chillies, the baby sweetcorn, asparagus and broccoli.
                Stir-fry for 3 minutes, then pour in the sauce. Cook for just a few minutes – you want to keep the veg on the edge of raw – adding a good splash of boiling water to loosen the sauce, if needed.
                Drizzle the honey into the chicken pan, turn the heat back up to high, and toss until sticky and caramelized. Plate up the veg and top with the chicken. Clank up the reserved crispy skin, and scatter over with the remaining chilli.
                Pick over the coriander leaves and serve right away, with lime wedges for squeezing over. Good with classic fluffy rice.
                
                Source: https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "1 x 227 g tin of pineapple in natural juice",
                    "1 x 213 g tin of peaches in natural juice",
                    "1 tablespoon low-salt soy sauce",
                    "1 tablespoon fish sauce",
                    "2 teaspoons cornflour",
                    "2 x 120 g free-range chicken breasts , skin on",
                    "Chinese five-spice",
                    "1 lime",
                    "2 cloves of garlic",
                    "1 bunch of asparagus , (350g)",
                    "100 g tenderstem broccoli",
                    "1 small onion",
                    "2 fresh red chillies",
                    "1 red pepper",
                    "1 yellow pepper",
                    "7 cm piece of ginger",
                    "groundnut oil",
                    "100 g baby sweetcorn",
                    "1 teaspoon runny honey",
                    "½ a bunch of fresh coriander , (15g)"
                ],
                "category": "Chinese",
                "image": "tom-daley.jpg"
            },
            {
                "name": "Veggie pad thai",
                "description": `Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.
                Lightly toast the peanuts in a large non-stick frying pan on a medium heat until golden, then bash in a pestle and mortar until fine, and tip into a bowl.
                Peel the garlic and bash to a paste with the tofu, add 1 teaspoon of sesame oil, 1 tablespoon of soy, the tamarind paste and chilli sauce, then squeeze and muddle in half the lime juice.
                Peel and finely slice the shallot, then place in the frying pan over a high heat. Trim, prep and slice the crunchy veg, as necessary, then dry-fry for 4 minutes, or until lightly charred (to bring out a nutty, slightly smoky flavour).
                Add the noodles, sauce, beansprouts, and a good splash of water, toss together over the heat for 1 minute, then divide between serving bowls.
                Wipe out the pan, crack in the eggs and cook to your liking in a little olive oil, sprinkling with a pinch of chilli flakes. Trim the lettuce, click apart the leaves and place a few in each bowl.
                Pop the eggs on top, pick over the herbs, and sprinkle with the nuts. Serve with lime wedges for squeezing over, and extra soy, to taste.
                
                Source: https://www.jamieoliver.com/recipes/vegetable-recipes/veggie-pad-thai/`,
                "email": "hello@hk.com",
                "ingredients": [
                    "150 g rice noodles",
                    "sesame oil",
                    "20 g unsalted peanuts",
                    "2 cloves of garlic",
                    "80 g silken tofu",
                    "low-salt soy sauce",
                    "2 teaspoons tamarind paste",
                    "2 teaspoons sweet chilli sauce",
                    "2 limes",
                    "1 shallot",
                    "320 g crunchy veg , such as asparagus, purple sprouting broccoli, pak choi, baby corn",
                    "80 g beansprouts",
                    "2 large free-range eggs",
                    "olive oil",
                    "dried chilli flakes",
                    "½ a cos lettuce",
                    "½ a mixed bunch of fresh basil, mint and coriander , (15g)"
                ],
                "category": "Thai",
                "image": "veggie-pad-thai.jpg"
            },
            
        ]);
    } catch(error){
        console.log('err', + error);
    }
}

insertDummyRecipeData();
*/