# Етап збірки (Build Stage)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копіюємо весь код бекенду
COPY . .

# Відновлюємо залежності та публікуємо
WORKDIR "/src/BiteWise.API"
RUN dotnet restore "BiteWise.API.csproj"
RUN dotnet publish "BiteWise.API.csproj" -c Release -o /app/publish

# Етап виконання (Runtime Stage)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "BiteWise.API.dll"]
