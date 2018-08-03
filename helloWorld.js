const express = require('express');
const app = express()

app.get('/', (req, res) => {

    let data1 = {
        Google:null,
        ddg:null,
        twitter:null
    }
    let q = req.query.q;
    var google = require('google')

    google.resultsPerPage = 1
    
    google(q, function (err, res){
    if (err) console.error(err)
        data1['Google'] = {
            title: res.links[0].title,
            link: res.links[0].link,
            description: res.links[0].description
        };
        console.log('----------- GOOGLE ----------------');
        console.log('Title = ',res.links[0].title);
        console.log('Link = ',res.links[0].link);
        console.log('Description = ',res.links[0].description);
    })

    //----------- DUCKDUCKGO ----------------

    ddg = require('ddg');
    try{
        ddg.query(q, function(err, data){
            if(data.RelatedTopics[0] !== undefined){
                data1['ddg'] = {
                    'text': data.RelatedTopics[0].Text,
                    'url': data.RelatedTopics[0].FirstURL
                }
                console.log('----------- DUCKDUCKGO ----------------');
                console.log('Text: ',data.RelatedTopics[0].Text) // logs a dictionary with all return fields
                console.log('FirstURL: ',data.RelatedTopics[0].FirstURL) // logs a dictionary with all return fields
            }
        });
    }
    catch(err){
        console.log(err);
    }

    //----------- TWITTER ----------------
    
    const Twitter = require('twitter');

    var client = new Twitter({
    consumer_key: 'ldcZqWf66J6zQk4XdDTo8LGxC',
    consumer_secret: 'a4PnXYSDN9X9D1NNnhA6OqJIfR2UN4laEuk1iYryCVQLLYrCc9',
    access_token_key: '588161115-hbDsW0EpoOHv0uXmzoYrzEYMF0PMDvgO9pHPxsDc',
    access_token_secret: 'LLwnmOcbqFkLzCQSM8niCU2kUbVxluZYIA9K9jMSmx77T'
    });
    
    var params = {screen_name: q};
    client.get('users/show', params, function(error, tweets, response) {
    if (!error) {
        data1['twitter'] = {
            'name': tweets.name,
            'location': tweets.location,
            'description': tweets.description
        };
        console.log('----------- TWITTER ----------------');
        console.log('Date: ',tweets.name);
        console.log('Location: ',tweets.location);
        console.log('Description: ',tweets.description);
        // console.log(tweets);
    }
    });

    setTimeout(exit, 4000);
    function exit(){
        console.log('------------- EXIT -----------------');
        res.json(data1);
        process.exit(-1)
    }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
