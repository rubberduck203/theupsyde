FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY theupsyde/theupsyde.fsproj ./theupsyde/theupsyde.fsproj
RUN dotnet restore theupsyde/theupsyde.fsproj

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release theupsyde/theupsyde.fsproj

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build-env /app/theupsyde/bin/Release/net5.0/publish/ .
ENTRYPOINT ["dotnet", "theupsyde.dll"]