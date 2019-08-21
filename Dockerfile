FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY theupsyde/theupsyde.fsproj ./theupsyde/theupsyde.fsproj
RUN dotnet restore theupsyde/theupsyde.fsproj

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release theupsyde/theupsyde.fsproj

# Build the runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY --from=build-env /app/theupsyde/bin/Release/netcoreapp2.2/publish/ .
ENTRYPOINT ["dotnet", "theupsyde.dll"]