each frontned folder (domain) should have structure as follows 
/media
/hooks
/utils

each component is to be as atomized as possible. 

example - a pagination menu 

page -> flexVertical(item,pagination dots)
item is a standalone file (component) that houses its own logic
pagination dots -> (pagination dot, pagination dot...) 
pagination dot -> pagination dot is a standalone file (component) that houses its own logic

I DO NOT WANT 20K LINE FILES - EVERYTHING NEEDS TO BE AS PER SOLID,DRY, YAGNI etc. I WANT EVERYTHING AS ATOMIZED AND AS DECOUPLED AS POSSIBLE. I WANT THE CODE PLAIN AND READABLE