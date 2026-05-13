Model: 'googleai/gemini-2.5-flash',

#in first terminal: npx tsx src/index.ts
#in second terminal: $body = @{ location="Kedah"; weatherForecast="Extremely hot and dry, 35 degrees"; cropType="Rice" } | ConvertTo-Json
                     Invoke-RestMethod -Uri "http://localhost:3000/api/farm-schedule" -Method Post -ContentType "application/json" -Body $body
//first is engine room to keep my server alive
//second is command center use for all got commands or test commands


test agent 1: $body1 = @{ 
>>     imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Tomato_leaf_with_early_blight.jpg/800px-Tomato_leaf_with_early_blight.jpg";
>>     language="Bahasa Malaysia"
>> } | ConvertTo-Json
>>
>> Invoke-RestMethod -Uri "http://localhost:3000/api/disease-detect" -Method Post -ContentType "application/json" -Body $body1



test agent 2: $body2 = @{ 
>>     location="Kedah";
>>     weatherForecast="Extremely hot and dry, 35 degrees";
>>     cropType="Rice"
>> } | ConvertTo-Json
>>
>> Invoke-RestMethod -Uri "http://localhost:3000/api/farm-schedule" -Method Post -ContentType "application/json" -Body $body2



test agent 3:$body3 = @{ 
    cropType="Durian"; 
    currentPrice="RM 40/kg" 
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/market-trends" -Method Post -ContentType "application/json" -Body $body3



test agent 4:$body4 = @{ 
    message="Daun pokok cili saya menjadi kuning, apa patut saya buat?"; 
    language="Bahasa Malaysia" 
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method Post -ContentType "application/json" -Body $body4




test agent 5: $body = @{ postText="这几天雨水太多，我的辣椒叶子变黄了，大家有什么建议吗？" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/translate" -Method Post -ContentType "application/json" -Body $body



Test the Outbreak System by pushing fake data, then searching for it:

PowerShell
# 1. Trigger the fake outbreak in Kulai
$outbreak = @{ disease="Brown Spot"; location="Kulai" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/trigger-outbreak" -Method Post -ContentType "application/json" -Body $outbreak

# 2. Check the alerts for Kulai (What Chloe's frontend will do)
Invoke-RestMethod -Uri "http://localhost:3000/api/alerts?location=Kulai" -Method Get





#if the first terminal command like this:PS C:\Users\jingc\Downloads\Node.js> <-cannot work
#need cd CTRLV-backend first 










console.log(`\n🚀 Smart Farm AI Server is LIVE on http://localhost:${PORT}`);
    console.log(`✅ Agent 1 Ready: POST http://localhost:${PORT}/api/disease-detect`);
    console.log(`✅ Agent 2 Ready: POST http://localhost:${PORT}/api/farm-schedule\n`);
})