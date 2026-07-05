{
  description = "Plata Browser Extention DevFlake";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };

    in
    {

      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          web-ext
        ];
      };

      packages.${system}.default = pkgs.stdenv.mkDerivation {
        pname = "plata";
        version = "0.1";

        src = ./src;

        nativeBuildInputs = with pkgs; [
          inkscape
          web-ext
        ];

        buildPhase = ''
          for size in 32 48 96 128; do 
              inkscape --export-type=png --export-width=$size --export-filename=icons/plata-$size.png icons/Plata.svg
          done
        '';

        installPhase = ''
          mkdir -p $out
          HOME=$TMPDIR web-ext build --source-dir . --artifacts-dir $out --overwrite-dest --ignore-files "icons/Hero.svg" --ignore-files "icons/Plata.svg"
        '';

      };

    };
}
