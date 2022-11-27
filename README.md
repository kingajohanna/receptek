# receptek

# backend

A szerveroldal telepítéséhez és futtatásához Docker futtatókörnyezetre van szükség, ez esetben egy egyszerű docker compose up paranccsal futtatható az összes szerveroldali komponens. A kliensoldalról ezután az API gateway konténerének IP címére kell küldeni a kéréseket.

# frontend

A futtatás lépései:
1. További dependenciák letöltése: npm i
2. iOS futtatásához a pod fileok telepítése: npx pod-install
3. iOS futtatása: npm run ios
4. Android futtatása: npm run android
