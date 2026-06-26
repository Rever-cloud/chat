cd C:\Users\UGCA\Desktop\rverse-ai
git add -A
git commit -m "Initial commit: RVerse AI Platform"
git remote remove origin 2>$null
git remote add origin https://github.com/Rever-cloud/chat.git
git branch -M main
git push -u origin main --force
